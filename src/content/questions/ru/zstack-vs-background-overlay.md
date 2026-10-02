---
title: "В SwiftUI чем отличается ZStack от модификаторов background/overlay."
category: swiftui
order: 7
---

`ZStack` накладывает дочерние view друг на друга, каждая следующая выше предыдущей. `background` и `overlay` кладут содержимое позади или перед view, к которой применены; несколько view в их замыкании собираются в неявный `ZStack`.

Разница в раскладке: слои можно получить и в `ZStack`, это даёт более простую иерархию, но меняет приоритет раскладки. Модификатор `background`/`overlay` используют, когда нужно, чтобы размер определяла исходная view.

```swift
Text("Hi").background { Color.blue }   // фон позади Text
ZStack { Color.blue; Text("Hi") }      // те же слои через ZStack
```
