---
title: "What is type erasure?"
category: swift
order: 143
---

Type erasure is a technique that hides a concrete type behind a common wrapper so that values of different types can be used uniformly. It is needed when a protocol cannot be used as a type (because of an `associatedtype` or `Self`) or when you need to hide implementation details.

Examples from the standard library and frameworks: `AnyHashable`, `AnySequence`, `AnyPublisher`, `AnyView`.

The simplest implementation is a wrapper with closures or an internal box:

```swift
protocol Shape { associatedtype Unit; func area() -> Double }

struct Circle: Shape { typealias Unit = Double; func area() -> Double { 3.14 } }
struct Square: Shape { typealias Unit = Double; func area() -> Double { 1 } }

struct AnyShape<Unit>: Shape {
    private let _area: () -> Double
    init<S: Shape>(_ shape: S) where S.Unit == Unit { _area = shape.area }
    func area() -> Double { _area() }
}

let shapes: [AnyShape<Double>] = [AnyShape(Circle()), AnyShape(Square())]
```

The cost: extra indirection and allocations, and the loss of type information. Starting with Swift 5.7, many cases are solved by the `any` keyword (existential types, including with primary associated types) and `some` (opaque types), so a hand-written erasing wrapper is needed less often.
