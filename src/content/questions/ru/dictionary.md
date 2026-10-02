---
title: "Что такое словарь? Как можно написать свой словарь?"
category: algorithms
order: 9
---

`Dictionary<Key, Value>` — коллекция пар «ключ — значение», реализованная как хеш-таблица, что даёт быстрый доступ к записям. Ключом может быть любой `Hashable`-тип, в том числе свой.

```swift
struct GridPoint { var x: Int; var y: Int }
extension GridPoint: Hashable {
    static func == (l: GridPoint, r: GridPoint) -> Bool { l.x == r.x && l.y == r.y }
    func hash(into hasher: inout Hasher) { hasher.combine(x); hasher.combine(y) }
}
var names: [GridPoint: String] = [GridPoint(x: 2, y: 3): "A"]
names[GridPoint(x: 2, y: 3)] // Optional("A")
```

Реализация в стандартной библиотеке — хеш-таблица с открытой адресацией и линейным пробированием (см. исходники Swift).
