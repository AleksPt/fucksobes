---
title: "What kinds of polymorphism are there? Compile-time and run-time polymorphism"
category: architecture
order: 52
---

Polymorphism is the ability to work with different types through a single interface. By the moment the implementation is chosen, there are two kinds.

**Compile-time (static, early binding)**: the implementation is chosen at compile time:

- **function and operator overloading** (`func f(_: Int)`, `func f(_: String)`);
- **parametric polymorphism: generics** (`func swapValues<T>(...)`); the compiler often specializes the code for a concrete type;
- calls to struct methods and `final` methods.

**Run-time (dynamic, late binding)**: the implementation is chosen at runtime based on the object's actual type:

- **method overriding** in subclasses (a call through the vtable);
- **protocols**: a value of type `any Protocol` calls the method through a witness table;
- calls through the Objective-C runtime (`@objc dynamic`).

```swift
class Animal { func voice() { print("...") } }
class Dog: Animal { override func voice() { print("Woof") } }
let a: Animal = Dog()
a.voice()        // "Woof": the implementation is chosen at runtime
```

Static polymorphism is faster and optimizes better; dynamic polymorphism is more flexible and lets you swap the implementation without recompiling the client.
