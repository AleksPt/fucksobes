---
title: "How do you handle errors?"
category: swift
order: 50
---

Errors in Swift are values of types that conform to the `Error` protocol (enums with associated values work well for this). An error is thrown with `throw`, and a function that can throw it is marked `throws`. `try` (or `try?` / `try!`) is written before calling such a function.

There are four ways to handle errors:

- propagate the error to the calling code (the function itself is marked `throws`);
- handle it in a `do`-`catch`: the error is matched against the `catch` clauses;
- convert it to an optional with `try?` (the result is `nil` on error);
- assert that there will be no error with `try!` (if an error does occur, it is a runtime error).

```swift
enum VendingMachineError: Error {
    case outOfStock
    case insufficientFunds(coinsNeeded: Int)
}

do {
    try buyFavoriteSnack(person: "Alice")
} catch VendingMachineError.insufficientFunds(let coins) {
    print("Need \(coins) more coins")
} catch {
    print("Error: \(error)")
}
```

To clean up resources regardless of how the block is exited (an error, `return`, `break`), use `defer`. Unlike exceptions in many languages, error handling in Swift does not unwind the call stack, so `throw` costs about the same as `return`.
