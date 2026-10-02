---
title: "How can you find out why SwiftUI redraws a View (_printChanges)?"
category: swiftui
order: 41
---

For debugging, there is an undocumented method `Self._printChanges()`: you call it inside `body`, and the console shows the reason SwiftUI re-evaluates the view: which property (`@State`, `@Binding`, `@ObservedObject`, `@Environment`, etc.) changed.

```swift
var body: some View {
    let _ = Self._printChanges()     // for example: "ContentView: _counter changed."
    Text("\(counter)")
}
```

`let _ =` is needed because inside `body` only expressions that return views are allowed. The method is for debugging only: it is private (prefixed with `_`) and should be removed from release builds, for example with `#if DEBUG`.

For deeper analysis, use the **SwiftUI** template in Instruments (View Body, View Properties, Update Groups). That is how you find unnecessary updates and optimize state dependencies.
