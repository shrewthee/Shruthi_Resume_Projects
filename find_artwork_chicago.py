import numpy as np

#ask user for values and create an array
user_input = input("Enter a list of numbers followed (separated by spaces): ")
numbers = list(map(float, user_input.split()))
array = np.array(numbers)
print("\nYour array:", array)

#ask user if they want mean, median, or sum
choice = input("\nDo you want to find the mean, median, or sum of the array? ").strip().lower()

#calculate
if choice == 'mean':
    result = np.mean(array)
    print(f"\nThe mean is: {result}")
elif choice == 'median':
    result = np.median(array)
    print(f"\nThe median is: {result}")
elif choice == 'sum':
    result = np.sum(array)
    print(f"\nThe sum is: {result}")
else:
    print("\nError. Please enter 'mean', 'median', or 'sum'.")
