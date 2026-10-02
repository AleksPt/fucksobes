---
title: "What is a variadic parameter?"
category: swift
order: 132
---

A variadic parameter accepts zero or more values of the same type. It is declared with three dots after the type, and inside the function it is available as an array.

```swift
func sum(_ numbers: Int...) -> Int {
    numbers.reduce(0, +)      // numbers: [Int]
}

sum()              // 0
sum(1, 2, 3)       // 6
```

Specifics:

- you call the function by listing the values separated by commas; you cannot pass an existing array directly (you would have to "expand" it manually or overload the function);
- a single function can have several variadic parameters (since Swift 5.4), as long as each is followed by a parameter with a label;
- an example from the standard library is `print(_:separator:terminator:)`.
