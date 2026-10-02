---
title: "What is a Binding in SwiftUI?"
category: swiftui
order: 11
---

`Binding` is a property wrapper that creates a two-way connection between a property that stores data and a view that displays and modifies it. A binding doesn't store the data itself; it references a source of truth that lives elsewhere.

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

The `$` prefix on a property wrapped in `@State` returns its `projectedValue` — a `Binding`. When the user taps the button, the state of `PlayerView` is updated.
