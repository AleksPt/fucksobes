---
title: "What is the difference between State and ObservedObject?"
category: swiftui
order: 10
---

`@State` is storage for a value managed by SwiftUI and the source of truth for a view's local state. You declare it `private` in the topmost view that needs it. `@ObservedObject` subscribes to an `ObservableObject` and updates the view when its `@Published` properties change; it is meant for a view's input parameter, and you shouldn't give it an initial value.

A practical consequence from the documentation: the object for `@ObservedObject` is created elsewhere (for example, as a `@StateObject`) and passed down to a subview.

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

Starting with iOS 17, for `@Observable` models, `@State` is used for storage instead of `StateObject`/`ObservedObject`, and a plain property (or `@Bindable`) is used for passing.
