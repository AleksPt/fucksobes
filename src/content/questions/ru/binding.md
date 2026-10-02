---
title: "Что такое Binding запрос в SwiftUI"
category: swiftui
order: 11
---

`Binding` — property wrapper, который создаёт двустороннюю связь между свойством, хранящим данные, и view, которая их показывает и изменяет. Binding не хранит данные сам, а ссылается на источник истины, лежащий в другом месте.

```swift
struct PlayButton: View {
    @Binding var isPlaying: Bool

    var body: some View {
        Button(isPlaying ? "Pause" : "Play") { isPlaying.toggle() }
    }
}

struct PlayerView: View {
    @State private var isPlaying = false

    var body: some View {
        PlayButton(isPlaying: $isPlaying)
    }
}
```

Префикс `$` у свойства, обёрнутого в `@State`, возвращает `projectedValue` — `Binding`. Когда пользователь нажимает кнопку, обновляется состояние `PlayerView`.
