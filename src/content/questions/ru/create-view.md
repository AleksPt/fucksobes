---
title: "Как создавать view в SwiftUI?"
category: swiftui
order: 21
---

Любое view — тип, соответствующий протоколу `View`. Единственное требование протокола — вычисляемое свойство `body`, которое описывает содержимое:

```swift
struct MyView: View {
    var body: some View {
        Text("Hello, World!")
    }
}
```
