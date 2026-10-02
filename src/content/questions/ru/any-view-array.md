---
title: "Можно ли хранить во View-массиве элементы разных типов через any View/AnyView?"
category: swiftui
order: 55
---

Напрямую нет: `View` — протокол с associated type (`Body`), поэтому у него нет единого конкретного типа, и массив вроде `[View]` компилятор не примет — нужен type erasure.

**Вариант 1 — `AnyView`:**

```swift
let views: [AnyView] = [
    AnyView(Text("Первый")),
    AnyView(Image(systemName: "star"))
]
```

`AnyView` стирает конкретный тип вью в рантайме. Минус — теряется статическая оптимизация diffing'а SwiftUI, что может ухудшить производительность при частых обновлениях.

**Вариант 2 — `any View` (экзистенциальный тип, Swift 5.7+):**

```swift
let views: [any View] = [Text("Первый"), Image(systemName: "star")]
```

Синтаксически похоже, но семантика отличается: это экзистенциальный контейнер языка Swift, а не специальная SwiftUI-обёртка. Главное отличие: `any View` сам не соответствует `View`, поэтому такой массив нельзя напрямую отрисовать в `ForEach` или `body` — компилятор выдаст ошибку `type 'any View' cannot conform to 'View'`. Элемент придётся обернуть в `AnyView(view)`.

На практике чаще используют `@ViewBuilder` с `TupleView`/`Group`, либо `AnyView`, если действительно нужен гетерогенный массив вью.
