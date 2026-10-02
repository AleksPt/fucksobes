---
title: "How do views work in SwiftUI?"
category: swiftui
order: 36
---

There are three key aspects of how SwiftUI sees a view:

- **Identity** — how SwiftUI tells whether a view in different updates is the same or a different one. In UIKit, views are reference types identified by a pointer. In SwiftUI, views are value types with no pointers, so identity is determined structurally (by position in the hierarchy, or by an explicit `id`), and it determines whether state is preserved and how a change is animated.
- **Lifetime** — how SwiftUI tracks the existence of views and data over time. When it encounters `@State` or `@StateObject`, it keeps that storage for as long as the view with the given identity exists: the storage is tied to that identity's life, not to the life of the struct.
- **Dependencies** — how SwiftUI knows when and why the interface needs to be updated. Dependencies are the view's inputs: properties, `@Binding`, `@State`, environment objects, and so on. When they change, `body` is re-evaluated.

```swift
struct TestView: View {
    @Binding var isOn: Bool   // dependency
    var name: String          // dependency

    var body: some View {
        Toggle(name, isOn: $isOn)
    }
}
```
