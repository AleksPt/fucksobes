---
title: "Пример полиморфизма на практике"
category: architecture
order: 4
---

В Swift один интерфейс можно реализовать разными типами, а работать с ними единообразно через тип протокола. Значение типа `any Protocol` соответствует протоколу в рантайме, и через него доступны только члены, объявленные в протоколе.

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

Аналогично работает наследование: подкласс может переопределить метод или свойство, унаследованные от суперкласса, и предоставить собственную реализацию.
