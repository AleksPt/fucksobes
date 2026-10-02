---
title: "What control transfer statements are there in Swift?"
category: swift
order: 114
---

Control transfer statements change the order in which code is executed:

- `break` — immediately ends a loop or a `switch`;
- `continue` — stops the current loop iteration and starts the next one;
- `return` — exits a function and returns a value;
- `throw` — throws an error from a function marked `throws`;
- `fallthrough` — in a `switch`, continues execution into the next `case` without checking its condition.

```swift
let n = 5
var text = "\(n) —"
switch n {
case 2, 3, 5, 7:
    text += " is prime,"
    fallthrough
case 10:
    text += " and case 10 was executed"
default:
    text += " is something else"
}
// 5 — is prime, and case 10 was executed
```

In Swift, a `case` in a `switch` does not fall through on its own as it does in C: after the matching `case`, execution leaves the `switch`, so a trailing `break` is not needed, while `fallthrough` must be written explicitly. There is also `guard … else`, whose body must end with one of the exit statements, and labels (`outer: for …`) that let you exit an outer loop with `break outer`.
