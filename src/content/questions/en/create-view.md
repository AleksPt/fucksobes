---
title: "How do you create a view in SwiftUI?"
category: swiftui
order: 21
---

Any view is a type that conforms to the `View` protocol. The protocol's only requirement is a computed `body` property that describes the content:

```swift
struct MyView: View {
    var body: some View {
        Text("Hello, World!")
    }
}
```
