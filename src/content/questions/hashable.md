---
title: "Что такое протокол Hashable?"
category: algorithms
order: 14
---

`Hashable` — протокол (наследует `Equatable`) для типов, значения которых можно хешировать в целое число. Такие типы можно использовать как элементы `Set` и как ключи `Dictionary`.

Требование — метод `hash(into:)`, в котором в `Hasher` передаются через `combine(_:)` те же компоненты, что сравнивает `==`. Равные экземпляры должны подавать одинаковые значения в одном порядке. Для структур, все свойства которых `Hashable`, и для enum с `Hashable`-ассоциированными значениями компилятор синтезирует реализацию сам; enum без ассоциированных значений становятся `Hashable` автоматически.

```swift
extension GridPoint: Hashable {
    static func == (l: GridPoint, r: GridPoint) -> Bool { l.x == r.x && l.y == r.y }
    func hash(into hasher: inout Hasher) {
        hasher.combine(x)
        hasher.combine(y)
    }
}
```
