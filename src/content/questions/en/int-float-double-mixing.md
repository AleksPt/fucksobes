---
title: "What causes the error in code that adds an Int, a Float, and a Double? How do you fix it?"
category: swift
order: 115
---

```swift
let n1: Int = 1
let n2: Float = 2.0
let n3: Double = 3.34
var result = n1 + n2 + n3   // compile-time error
```

Swift is a strongly typed language and does not perform implicit conversions between numeric types: the `+` operator requires two operands of the same type, but here we have `Int`, `Float`, and `Double`. To add the numbers, you have to convert them explicitly to a single type, usually the widest one:

```swift
let result = Double(n1) + Double(n2) + n3   // 6.34
```

This makes it easier to notice a loss of precision (for example, when going from `Double` to `Float` or `Int`) and avoids hidden bugs caused by automatic conversions. Literals are more flexible: `let x: Double = 1` works because the literal `1` adapts to the required type.
