---
title: "What is the difference between a class and an object of a class?"
category: swift
order: 151
---

A **class** is a description, a template: it defines properties, methods, and initializers. By itself it does not store the data of any particular entity.

An **object** (an instance) is a specific entity created from that template. Each object has its own property values and occupies memory on the heap.

```swift
class Dog {            // the class
    var name: String
    init(name: String) { self.name = name }
}

let a = Dog(name: "Rex")    // two different objects
let b = Dog(name: "Buddy")  // of the same class
```

A class in Swift also exists at runtime as type metadata: it stores the method table, the superclass, and the instance size. Each object contains a pointer to this metadata. The type itself is accessed through `Dog.self`, and static properties and methods (`static`, `class`) are accessed without creating an object.
