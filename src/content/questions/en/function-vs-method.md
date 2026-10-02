---
title: "What is the difference between a function and a method?"
category: swift
order: 89
---

A function is a self-contained block of code declared globally or inside another function; it is not tied to a type. A method is a function declared inside a type (a class, struct, enum, or protocol) that works with an instance of it or with the type itself.

```swift
func greet(_ name: String) { print("Hi, \(name)") }   // a function

struct User {
    var name: String
    func greet() { print("Hi, \(name)") }              // a method: has access to self
}
```

Instance methods receive an implicit `self` parameter and have access to the type's properties and other methods. There are also type methods (`static` and `class`), which are called on the type itself. Methods of structs and enums that modify state are marked `mutating`. Technically, a method is a function bound to a type, and they differ mainly in scope and calling context.
