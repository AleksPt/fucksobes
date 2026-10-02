---
title: "What is the indirect keyword for?"
category: swift
order: 48
---

For creating recursive enums: when an associated value of a case has the type of the enum itself.

```swift
enum Example {
    case something(Int, Example)   // error: recursive enum without indirect
}

indirect enum Expression {
    case number(Int)
    case addition(Expression, Expression)
    case multiplication(Expression, Expression)
}
```

An enum is a value type, and the compiler must know its size, but for a recursive one the size would be infinite. `indirect` makes the associated values be stored indirectly, through a pointer to the heap, so the size becomes finite. The keyword can be placed before an individual case (`indirect case …`) or before the whole enum. It is used for trees, linked lists, and expressions.
