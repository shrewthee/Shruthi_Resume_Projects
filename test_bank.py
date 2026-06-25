import os
import tempfile
import unittest

from models import SavingsAccount, CheckingAccount, TransactionType
from exceptions import (
    InsufficientFundsError,
    InvalidPINError,
    AccountLockedError,
    InvalidAmountError,
)
from bank import Bank


class TestAccountBasics(unittest.TestCase):
    def setUp(self):
        self.acc = CheckingAccount("Alice", pin="1234", balance=100.0)

    def test_deposit_increases_balance(self):
        self.acc.deposit(50)
        self.assertEqual(self.acc.balance, 150.0)

    def test_deposit_rejects_non_positive_amounts(self):
        with self.assertRaises(InvalidAmountError):
            self.acc.deposit(0)
        with self.assertRaises(InvalidAmountError):
            self.acc.deposit(-10)

    def test_withdraw_with_correct_pin(self):
        self.acc.withdraw(30, "1234")
        self.assertEqual(self.acc.balance, 70.0)

    def test_withdraw_with_wrong_pin_does_not_change_balance(self):
        with self.assertRaises(InvalidPINError):
            self.acc.withdraw(10, "0000")
        self.assertEqual(self.acc.balance, 100.0)

    def test_transaction_history_records_entries(self):
        self.acc.deposit(20)
        self.acc.withdraw(10, "1234")
        self.assertEqual(len(self.acc.transactions), 2)
        self.assertEqual(self.acc.transactions[0].ttype, TransactionType.DEPOSIT)
        self.assertEqual(self.acc.transactions[1].ttype, TransactionType.WITHDRAWAL)


class TestPINAuthentication(unittest.TestCase):
    def setUp(self):
        self.acc = CheckingAccount("Alice", pin="1234", balance=100.0)

    def test_account_locks_after_three_failed_attempts(self):
        for _ in range(2):
            with self.assertRaises(InvalidPINError):
                self.acc.withdraw(10, "0000")
        with self.assertRaises(AccountLockedError):
            self.acc.withdraw(10, "0000")
        self.assertTrue(self.acc.locked)

    def test_locked_account_rejects_even_correct_pin(self):
        for _ in range(3):
            try:
                self.acc.withdraw(10, "0000")
            except (InvalidPINError, AccountLockedError):
                pass
        with self.assertRaises(AccountLockedError):
            self.acc.withdraw(10, "1234")

    def test_successful_auth_resets_failed_attempts(self):
        with self.assertRaises(InvalidPINError):
            self.acc.withdraw(10, "0000")
        self.acc.withdraw(10, "1234")  # correct PIN
        self.assertEqual(self.acc.failed_attempts, 0)

    def test_change_pin(self):
        self.acc.change_pin("1234", "5678")
        self.acc.withdraw(10, "5678")  # new PIN works
        self.assertEqual(self.acc.balance, 90.0)


class TestCheckingOverdraft(unittest.TestCase):
    def test_overdraft_allowed_within_limit(self):
        acc = CheckingAccount("Bob", pin="1111", balance=50.0)
        acc.withdraw(200, "1111")  # 50 - 200 = -150, within -200 limit
        self.assertEqual(acc.balance, -150.0)

    def test_overdraft_blocked_beyond_limit(self):
        acc = CheckingAccount("Bob", pin="1111", balance=50.0)
        with self.assertRaises(InsufficientFundsError):
            acc.withdraw(300, "1111")


class TestSavingsMinimumBalance(unittest.TestCase):
    def test_withdrawal_blocked_below_minimum(self):
        acc = SavingsAccount("Carol", pin="2222", balance=150.0)
        with self.assertRaises(InsufficientFundsError):
            acc.withdraw(100, "2222")  # would leave 50, below the 100 minimum

    def test_withdrawal_allowed_exactly_at_minimum(self):
        acc = SavingsAccount("Carol", pin="2222", balance=150.0)
        acc.withdraw(50, "2222")
        self.assertEqual(acc.balance, 100.0)


class TestInterestCalculations(unittest.TestCase):
    def test_savings_interest_rate(self):
        acc = SavingsAccount("Dana", pin="3333", balance=1000.0)
        interest = acc.apply_interest()
        self.assertAlmostEqual(interest, 25.0)
        self.assertAlmostEqual(acc.balance, 1025.0)

    def test_checking_interest_rate(self):
        acc = CheckingAccount("Eve", pin="4444", balance=1000.0)
        interest = acc.apply_interest()
        self.assertAlmostEqual(interest, 1.0)
        self.assertAlmostEqual(acc.balance, 1001.0)

    def test_interest_on_zero_balance_is_zero(self):
        acc = SavingsAccount("Frank", pin="5555", balance=0.0)
        self.assertEqual(acc.apply_interest(), 0)


class TestBankFilePersistence(unittest.TestCase):
    def setUp(self):
        fd, self.path = tempfile.mkstemp(suffix=".json")
        os.close(fd)
        os.remove(self.path)  # Bank.load() must tolerate a missing file

    def tearDown(self):
        if os.path.exists(self.path):
            os.remove(self.path)

    def test_save_and_reload_preserves_balance_and_history(self):
        bank = Bank(data_file=self.path)
        acc = bank.open_account("Grace", "5555", "savings", initial_deposit=500.0)
        acc.deposit(100)
        bank.save()

        reloaded = Bank(data_file=self.path)
        reloaded_acc = reloaded.get_account(acc.account_number)
        self.assertEqual(reloaded_acc.balance, 600.0)
        self.assertEqual(len(reloaded_acc.transactions), 2)
        self.assertTrue(reloaded_acc.verify_pin("5555"))
        self.assertIsInstance(reloaded_acc, SavingsAccount)

    def test_transfer_between_accounts(self):
        bank = Bank(data_file=self.path)
        a = bank.open_account("Heidi", "6666", "checking", 200.0)
        b = bank.open_account("Ivan", "7777", "checking", 0.0)
        bank.transfer(a.account_number, b.account_number, 50, "6666")
        self.assertEqual(bank.get_account(a.account_number).balance, 150.0)
        self.assertEqual(bank.get_account(b.account_number).balance, 50.0)

    def test_account_not_found_raises(self):
        from exceptions import AccountNotFoundError

        bank = Bank(data_file=self.path)
        with self.assertRaises(AccountNotFoundError):
            bank.get_account("0000000000")


if __name__ == "__main__":
    unittest.main(verbosity=2)
