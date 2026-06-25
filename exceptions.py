"""Custom exceptions for the Bank Account Simulation System."""


class BankError(Exception):
    """Base class for all bank-related errors."""


class InsufficientFundsError(BankError):
    """Raised when a withdrawal/transfer would violate balance rules."""


class InvalidPINError(BankError):
    """Raised when an incorrect PIN is supplied."""


class AccountLockedError(BankError):
    """Raised when an account is locked due to too many failed PIN attempts."""


class InvalidAmountError(BankError):
    """Raised when a deposit/withdrawal amount is not valid (e.g. <= 0)."""


class AccountNotFoundError(BankError):
    """Raised when an account number does not exist in the bank."""
