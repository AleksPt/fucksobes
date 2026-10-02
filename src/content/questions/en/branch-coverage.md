---
title: "What is branch coverage?"
category: testing
order: 19
---

Branch coverage shows what share of the branches of conditional constructs the tests have exercised: every `if`, `guard`, `switch` and ternary operator has a "condition met" branch and a "not met" branch, and the metric counts how many of them were executed.

```swift
func discount(for age: Int) -> Int {
    if age >= 65 { return 20 }   // branch 1
    return 0                     // branch 2
}
```

A test with `age = 70` gives full line coverage of the first branch, but only one of the two branches is exercised (50% branch coverage): the `age < 65` case is not checked. That is why branch coverage is stricter than line coverage: it requires both outcomes of every condition to be checked. Xcode mainly shows line and function coverage, and branch data can be obtained through `llvm-cov`.
