from bank import Bank
from exceptions import BankError

MENU = """
==== Python Bank ====
1. Open account
2. Deposit
3. Withdraw
4. Transfer
5. Check balance
6. Transaction history
7. Apply interest to all accounts (admin)
8. Exit
"""


def main():
    bank = Bank()  # loads existing accounts from bank_data.json if present

    while True:
        print(MENU)
        choice = input("Choose an option: ").strip()
        try:
            if choice == "1":
                name = input("Owner name: ").strip()
                pin = input("Set a 4-digit PIN: ").strip()
                acc_type = input("Account type (savings/checking): ").strip().lower()
                deposit = float(input("Initial deposit [0]: ") or 0)
                acc = bank.open_account(name, pin, acc_type, deposit)
                print(f"\nAccount created! Number: {acc.account_number}  Type: {acc_type}")

            elif choice == "2":
                num = input("Account number: ").strip()
                amount = float(input("Amount to deposit: "))
                acc = bank.get_account(num)
                acc.deposit(amount)
                bank.save()
                print(f"New balance: {acc.balance:.2f}")

            elif choice == "3":
                num = input("Account number: ").strip()
                pin = input("PIN: ").strip()
                amount = float(input("Amount to withdraw: "))
                acc = bank.get_account(num)
                acc.withdraw(amount, pin)
                bank.save()
                print(f"New balance: {acc.balance:.2f}")

            elif choice == "4":
                src = input("From account: ").strip()
                dst = input("To account: ").strip()
                pin = input("PIN for source account: ").strip()
                amount = float(input("Amount: "))
                bank.transfer(src, dst, amount, pin)
                print("Transfer complete.")

            elif choice == "5":
                num = input("Account number: ").strip()
                pin = input("PIN: ").strip()
                acc = bank.get_account(num)
                acc.verify_pin(pin)
                print(f"Balance: {acc.balance:.2f}")

            elif choice == "6":
                num = input("Account number: ").strip()
                pin = input("PIN: ").strip()
                acc = bank.get_account(num)
                acc.verify_pin(pin)
                print("\n" + acc.statement())

            elif choice == "7":
                results = bank.apply_interest_all()
                for num, interest in results.items():
                    print(f"Account {num}: +{interest:.2f} interest")

            elif choice == "8":
                print("Goodbye!")
                break

            else:
                print("Invalid option.")

        except BankError as e:
            print(f"\nError: {e}")
        except ValueError:
            print("\nInvalid input — please enter a valid number.")


if __name__ == "__main__":
    main()
