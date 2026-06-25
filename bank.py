import json
import os

from models import Account, SavingsAccount, CheckingAccount
from exceptions import AccountNotFoundError

ACCOUNT_CLASSES = {
    "SavingsAccount": SavingsAccount,
    "CheckingAccount": CheckingAccount,
    "Account": Account,
}


class Bank:
    def __init__(self, data_file="bank_data.json"):
        self.data_file = data_file
        self.accounts = {}  # account_number -> Account instance
        self.load()

    # ---------- Account management ----------

    def open_account(self, owner_name, pin, account_type="checking", initial_deposit=0.0):
        account_type = account_type.lower()
        cls = {"savings": SavingsAccount, "checking": CheckingAccount}.get(account_type)
        if cls is None:
            raise ValueError("account_type must be 'savings' or 'checking'")

        account = cls(owner_name, pin=pin, balance=0.0)
        if initial_deposit:
            account.deposit(initial_deposit, description="Initial deposit")

        self.accounts[account.account_number] = account
        self.save()
        return account

    def get_account(self, account_number):
        account = self.accounts.get(account_number)
        if not account:
            raise AccountNotFoundError(f"No account found with number {account_number}")
        return account

    def authenticate(self, account_number, pin):
        """Verify a customer's PIN. Returns True or raises an auth-related error."""
        return self.get_account(account_number).verify_pin(pin)

    def close_account(self, account_number):
        self.get_account(account_number)  # raises if missing
        del self.accounts[account_number]
        self.save()

    # ---------- Money movement ----------

    def transfer(self, from_number, to_number, amount, pin):
        source = self.get_account(from_number)
        destination = self.get_account(to_number)
        source.withdraw(amount, pin, description=f"Transfer to {to_number}")
        destination.deposit(amount, description=f"Transfer from {from_number}")
        self.save()

    def apply_interest_all(self):
        """Apply each account's interest rate to its own balance. Returns {account_number: interest}."""
        results = {num: acc.apply_interest() for num, acc in self.accounts.items()}
        self.save()
        return results

    # ---------- File handling ----------

    def save(self):
        data = {num: acc.to_dict() for num, acc in self.accounts.items()}
        with open(self.data_file, "w") as f:
            json.dump(data, f, indent=2)

    def load(self):
        if not os.path.exists(self.data_file):
            return
        with open(self.data_file, "r") as f:
            raw = f.read().strip()
        if not raw:
            return
        data = json.loads(raw)
        for num, d in data.items():
            cls = ACCOUNT_CLASSES.get(d.get("account_type", "Account"), Account)
            self.accounts[num] = cls.from_dict(d)
