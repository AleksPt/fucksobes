---
title: "What is guard?"
category: swift
order: 92
---

`guard` checks a condition and, if it is not met, must exit the current scope (`return`, `throw`, `break`, `continue`, or a call to a function that returns `Never`). It is convenient for early exits: we check the requirements at the start of the function and then write the main flow without nesting.

```swift
func show(_ user: User?) {
    guard let user else { return }        // from here on user is not an optional
    guard user.isActive else { return }
    print(user.name)
}
```

Variables unwrapped in `guard let` remain available after it for the rest of the scope, unlike with `if let`. The `else` branch must end execution; the compiler checks this at compile time.
