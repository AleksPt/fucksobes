---
title: "What is the difference between if let and guard let?"
category: swift
order: 93
---

Both safely unwrap an optional, but they differ in the scope of the unwrapped value and in code style:

- `if let` creates the value only inside its block: it is not available outside, and the `else` branch is optional.
- `guard let` makes the value available after it for the rest of the scope; the `else` block is mandatory and must exit the scope (`return`, `throw`, `continue`, etc.).

```swift
if let name = user.name {
    print(name)            // name is visible only here
}

guard let name = user.name else { return }
print(name)                // name is visible below as well
```

`if let` fits when you just need to perform an action if a value is present. `guard let` fits for checking preconditions: the main code stays at one nesting level, and the handling of the "failure" case comes right at the start.
