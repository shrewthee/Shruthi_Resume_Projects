import hashlib
import os
import uuid
from datetime import datetime
from enum import Enum

from exceptions import (
    InsufficientFundsError,
    InvalidPINError,
    AccountLockedError,
    InvalidAmountError,
)

MAX_PIN_ATTEMPTS = 3


class TransactionType(Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    INTEREST = "INTEREST"


class Transaction:
    """A single immutable record in an account's transaction history."""

    def __init__(self, ttype, amount, balance_after, description="", timestamp=None):
        self.ttype = ttype  # TransactionType enum
        self.amount = amount  # positive for credit, negative for debit
        self.balance_after = balance_after
        self.description = description
        self.timestamp = timestamp or datetime.now().isoformat(timespec="seconds")

    def to_dict(self):
        return {
            "type": self.ttype.value,
            "amount": self.amount,
            "balance_after": self.balance_after,
            "description": self.description,
            "timestamp": self.timestamp,
        }

    @classmethod
    def from_dict(cls, d):
        return cls(
            TransactionType(d["type"]),
            d["amount"],
            d["balance_after"],
            d.get("description", ""),
            d.get("timestamp"),
        )

    def __str__(self):
        sign = "+" if self.amount >= 0 else ""
        return (
            f"[{self.timestamp}] {self.ttype.value:<10} "
            f"{sign}{self.amount:>10.2f}  Balance: {self.balance_after:>10.2f}  {self.description}"
        )


class Account:
    """Base bank account. Subclasses define INTEREST_RATE and withdrawal rules."""

    INTEREST_RATE = 0.0  # annual rate as a decimal, overridden by subclasses

    def __init__(
        self,
        owner_name,
        account_number=None,
        pin=None,
        balance=0.0,
        pin_hash=None,
        pin_salt=None,
        transactions=None,
        failed_attempts=0,
        locked=False,
    ):
        self.owner_name = owner_name
        self.account_number = account_number or str(uuid.uuid4().int)[:10]
        self.balance = float(balance)
        self.transactions = transactions or []
        self.failed_attempts = failed_attempts
        self.locked = locked

        if pin is not None:
            self.pin_salt = os.urandom(16).hex()
            self.pin_hash = self._hash_pin(pin, self.pin_salt)
        else:
            # Used when restoring an account from saved data
            self.pin_salt = pin_salt
            self.pin_hash = pin_hash

    # ---------- PIN authentication ----------

    @staticmethod
    def _hash_pin(pin, salt):
        return hashlib.pbkdf2_hmac(
            "sha256", str(pin).encode(), bytes.fromhex(salt), 100_000
        ).hex()

    def verify_pin(self, pin):
        """Return True if the PIN is correct; raise otherwise. Tracks lockout."""
        if self.locked:
            raise AccountLockedError(
                f"Account {self.account_number} is locked due to too many failed PIN attempts."
            )
        if self._hash_pin(pin, self.pin_salt) == self.pin_hash:
            self.failed_attempts = 0
            return True

        self.failed_attempts += 1
        if self.failed_attempts >= MAX_PIN_ATTEMPTS:
            self.locked = True
            raise AccountLockedError("Account locked after 3 failed PIN attempts.")
        remaining = MAX_PIN_ATTEMPTS - self.failed_attempts
        raise InvalidPINError(f"Incorrect PIN. {remaining} attempt(s) remaining.")

    def change_pin(self, old_pin, new_pin):
        self.verify_pin(old_pin)
        self.pin_salt = os.urandom(16).hex()
        self.pin_hash = self._hash_pin(new_pin, self.pin_salt)

    # ---------- Core operations ----------

    def deposit(self, amount, description="Deposit"):
        if amount <= 0:
            raise InvalidAmountError("Deposit amount must be positive.")
        self.balance += amount
        self._log(TransactionType.DEPOSIT, amount, description)
        return self.balance

    def withdraw(self, amount, pin, description="Withdrawal"):
        """Default rule: cannot withdraw more than the balance. Subclasses override."""
        if amount <= 0:
            raise InvalidAmountError("Withdrawal amount must be positive.")
        self.verify_pin(pin)
        if amount > self.balance:
            raise InsufficientFundsError(f"Insufficient funds. Balance: {self.balance:.2f}")
        self.balance -= amount
        self._log(TransactionType.WITHDRAWAL, -amount, description)
        return self.balance

    def apply_interest(self):
        """Apply this account's interest rate to the current balance."""
        interest = round(self.balance * self.INTEREST_RATE, 2)
        if interest > 0:
            self.balance += interest
            self._log(
                TransactionType.INTEREST, interest, f"Interest at {self.INTEREST_RATE * 100:.2f}%"
            )
        return interest

    def _log(self, ttype, amount, description):
        self.transactions.append(Transaction(ttype, amount, self.balance, description))

    def statement(self, limit=None):
        """Return a formatted transaction history (most recent `limit` entries)."""
        txs = self.transactions[-limit:] if limit else self.transactions
        if not txs:
            return "No transactions yet."
        return "\n".join(str(t) for t in txs)

    # ---------- Persistence ----------

    def to_dict(self):
        return {
            "owner_name": self.owner_name,
            "account_number": self.account_number,
            "balance": self.balance,
            "pin_hash": self.pin_hash,
            "pin_salt": self.pin_salt,
            "transactions": [t.to_dict() for t in self.transactions],
            "failed_attempts": self.failed_attempts,
            "locked": self.locked,
            "account_type": self.__class__.__name__,
        }

    @classmethod
    def from_dict(cls, d):
        return cls(
            owner_name=d["owner_name"],
            account_number=d["account_number"],
            pin=None,
            balance=d["balance"],
            pin_hash=d["pin_hash"],
            pin_salt=d["pin_salt"],
            transactions=[Transaction.from_dict(t) for t in d.get("transactions", [])],
            failed_attempts=d.get("failed_attempts", 0),
            locked=d.get("locked", False),
        )

    def __repr__(self):
        return f"{self.__class__.__name__}({self.owner_name!r}, #{self.account_number}, balance={self.balance:.2f})"


class SavingsAccount(Account):
    """Earns interest but must keep a minimum balance at all times."""

    INTEREST_RATE = 0.025  # 2.5%
    MIN_BALANCE = 100.0

    def withdraw(self, amount, pin, description="Withdrawal"):
        if amount <= 0:
            raise InvalidAmountError("Withdrawal amount must be positive.")
        self.verify_pin(pin)
        if self.balance - amount < self.MIN_BALANCE:
            raise InsufficientFundsError(
                f"Savings accounts must maintain a minimum balance of {self.MIN_BALANCE:.2f}."
            )
        self.balance -= amount
        self._log(TransactionType.WITHDRAWAL, -amount, description)
        return self.balance


class CheckingAccount(Account):
    """Low interest, but allows overdraft up to a fixed limit."""

    INTEREST_RATE = 0.001  # 0.1%
    OVERDRAFT_LIMIT = 200.0

    def withdraw(self, amount, pin, description="Withdrawal"):
        if amount <= 0:
            raise InvalidAmountError("Withdrawal amount must be positive.")
        self.verify_pin(pin)
        if self.balance - amount < -self.OVERDRAFT_LIMIT:
            raise InsufficientFundsError(
                f"Withdrawal exceeds overdraft limit of {self.OVERDRAFT_LIMIT:.2f}."
            )
        self.balance -= amount
        self._log(TransactionType.WITHDRAWAL, -amount, description)
        return self.balance
