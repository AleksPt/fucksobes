---
title: "Как понять, из-за чего SwiftUI перерисовывает View (_printChanges)?"
category: swiftui
order: 41
---

Для отладки есть недокументированный метод `Self._printChanges()`: его вызывают внутри `body`, и в консоль выводится причина, по которой SwiftUI пересчитывает представление: какое свойство (`@State`, `@Binding`, `@ObservedObject`, `@Environment` и т. д.) изменилось.

```swift
var body: some View {
    let _ = Self._printChanges()     // например: "ContentView: _counter changed."
    Text("\(counter)")
}
```

`let _ =` нужен, потому что `ViewBuilder` не принимает голый вызов, возвращающий `Void`: `()` не является `View`, и без `let _ =` будет ошибка компиляции. Метод предназначен только для отладки: он приватный (с префиксом `_`), его нужно убирать из релизной сборки, например с помощью `#if DEBUG`.

Для более глубокого анализа используют шаблон **SwiftUI** в Instruments (View Body, View Properties, Update Groups). Так находят лишние обновления и оптимизируют зависимости от состояния.
