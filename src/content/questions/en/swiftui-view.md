---
title: "What is a View in SwiftUI?"
category: swiftui
order: 2
---

`View` is a protocol whose conforming type describes a part of the app's user interface and provides modifiers for configuring it. The only required member is the computed `body` property, which returns the view's content.

```swift
struct MyView: View {
    var body: some View {
        Text("Hello, World!")
    }
}
```

You build `body` from SwiftUI's built-in views and your own views, forming a hierarchy. Modifiers are methods with default implementations: they wrap a view in a new view with the desired properties (for example, `Text("Hello").opacity(0.5)`).
