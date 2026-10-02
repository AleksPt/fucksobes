---
title: "How do you compare two objects by reference?"
category: swift
order: 13
---

With the identity operator `===` (and `!==` for the opposite check). It returns `true` if two references point to the same class instance, that is, to the same memory address.

```swift
class Fruit { var name = "Banana" }

let a = Fruit()
let b = a
let c = Fruit()

a === b   // true: the same reference
a === c   // false: different objects with identical contents
```

Don't confuse it with `==`: that is the equality operator, which compares values and works for types that conform to `Equatable`. Two different objects can be equal by `==` and still not identical by `===`. The `===` operator applies only to class instances (reference types); for structs and enums it makes no sense, because values are copied.
