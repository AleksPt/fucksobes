---
title: "What are virtual functions?"
category: architecture
order: 64
---

A virtual function is a method whose implementation is chosen at runtime based on the object's actual type rather than on the variable's type. It is the basis of dynamic polymorphism: calling a method through a reference to a base class runs the subclass's overridden version.

In C++, such methods are marked `virtual`. In Swift, all class methods are virtual by default (unless they are `final`, or `private` with no overrides, or `static`): the call goes through a virtual method table (vtable), which stores pointers to the implementations for each class.

```swift
class Shape { func draw() { print("shape") } }
class Circle: Shape { override func draw() { print("circle") } }
let s: Shape = Circle()
s.draw()    // "circle": the method is chosen by the actual type
```

The cost: the call goes through an extra pointer and gets in the way of inlining, so `final`, structs, and `private` let the compiler call the method directly (static dispatch). For protocols, the analog of the vtable is the protocol witness table.
