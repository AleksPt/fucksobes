---
title: "How would you simplify if-else code that calls different functions depending on age?"
category: swift
order: 118
---

```swift
if age >= 18 {
    driveCar()
} else {
    doNotDrive()
}
```

The code is correct, but it can be written more briefly with the ternary operator `condition ? A : B`:

```swift
age >= 18 ? driveCar() : doNotDrive()
```

The ternary operator is good for a simple choice between two values (`let status = age >= 18 ? "adult" : "minor"`). For calls to functions with side effects, a regular `if-else` often reads better, so here it is a matter of style. It is wiser to make the condition meaningful: extract the check into a named value (`var canDrive: Bool { age >= 18 }`) or a constant (`let legalAge = 18`) to get rid of the "magic number". Since Swift 5.9, `if` and `switch` can be used as expressions: `let text = if age >= 18 { "adult" } else { "minor" }`.
