---
title: "В чем разница между State и ObservedObject"
category: swiftui
order: 10
---

`@State` — хранилище значения, которым управляет SwiftUI, и источник истины для локального состояния view. Объявляют его `private` в самой верхней view, которой оно нужно. `@ObservedObject` подписывается на `ObservableObject` и обновляет view при изменении его `@Published`-свойств; он предназначен для входного параметра view, и начальное значение ему задавать не нужно.

Практическое следствие из документации: объект для `@ObservedObject` создают в другом месте (например, как `@StateObject`) и передают в подвью.

```swift
struct MyView: View {
    @StateObject private var model = DataModel()

    var body: some View { MySubView(model: model) }
}

struct MySubView: View {
    @ObservedObject var model: DataModel
    // ...
}
```

Начиная с iOS 17 для моделей с `@Observable` вместо `StateObject`/`ObservedObject` используют `@State` для хранения и обычное свойство (или `@Bindable`) для передачи.
