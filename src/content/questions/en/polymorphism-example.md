---
title: "A practical example of polymorphism"
category: architecture
order: 4
---

In Swift, one interface can be implemented by different types, and they can be handled uniformly through the protocol type. A value of type `any Protocol` conforms to the protocol at runtime, and only the members declared in the protocol are accessible through it.

```swift
protocol HasArea {
    var area: Double { get }
}

struct Circle: HasArea {
    var radius: Double
    var area: Double { 3.14159 * radius * radius }
}

struct Square: HasArea {
    var side: Double
    var area: Double { side * side }
}

let shapes: [any HasArea] = [Circle(radius: 2), Square(side: 3)]
let total = shapes.reduce(0) { $0 + $1.area }
```

Inheritance works similarly: a subclass can override a method or property inherited from a superclass and provide its own implementation.
