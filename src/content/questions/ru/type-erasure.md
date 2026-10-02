---
title: "Что такое type erasure (стирание типов)?"
category: swift
order: 143
---

Type erasure — приём, который прячет конкретный тип за общей обёрткой, чтобы использовать значения разных типов единообразно. Нужен, когда протокол нельзя использовать как тип (из-за `associatedtype` или `Self`) или когда нужно скрыть детали реализации.

Примеры из стандартной библиотеки и фреймворков: `AnyHashable`, `AnySequence`, `AnyPublisher`, `AnyView`.

Простейшая реализация — обёртка с замыканиями или внутренним боксом:

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

Цена: дополнительная косвенность и аллокации, потеря информации о типе. Начиная с Swift 5.7 многие случаи решают ключевые слова `any` (экзистенциальные типы, в том числе с primary associated types) и `some` (opaque types), поэтому ручная стирающая обёртка нужна реже.
