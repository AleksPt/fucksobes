---
title: "What is the difference between a for loop and forEach?"
category: swift
order: 100
---

Both iterate over the elements of a sequence, but they differ in capabilities:

- In `for … in`, `break`, `continue`, and `return` from the enclosing function are available, as is exiting the loop early. Inside it you can use `try` and `await` without restrictions, and the compiler optimizes it as an ordinary loop.
- `forEach` is a method that takes a closure. A `return` inside it exits only the current iteration (like `continue`), and you cannot abort the whole traversal. It is convenient in call chains and with function references: `items.forEach(print)`.

```swift
for x in [1, 2, 3] { if x == 2 { break }; print(x) }   // 1
[1, 2, 3].forEach { if $0 == 2 { return }; print($0) } // 1, 3
```

`forEach` gives no particular speed advantage; it is also unsuitable for `async` closures: `forEach` will not wait for them to complete (unlike `for await`). So `for … in` is preferred for ordinary traversals.
