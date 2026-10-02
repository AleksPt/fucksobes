---
title: "Why do we need the `any` and `some` keywords?"
category: swift
order: 70
---

Both keywords hide the concrete type of a value behind a protocol, but in different ways.

`some` (an opaque type) means one specific concrete type whose identity is hidden from the calling code: the compiler knows it, clients of the module do not. The function implementation chooses the return type itself, whereas in a generic function the type is chosen by the caller.

`any` (a boxed protocol type, also known as an existential type) means a value of any type that conforms to the protocol; the concrete type is known only at runtime and can change. That makes `any` more flexible: `[any Shape]` can store elements of different types, while `[some Shape]` can only hold one hidden type. In return, `some` gives stronger guarantees: for example, it preserves operations that depend on the exact type (such as `==`), whereas a value of type `any Shape` does not itself conform to the `Shape` protocol (the exceptions are `Error` and `@objc` protocols).

```swift
func makeShape() -> some Shape { Triangle(size: 3) }

var shapes: [any Shape] = [Triangle(size: 3), Square(size: 2)]
```
