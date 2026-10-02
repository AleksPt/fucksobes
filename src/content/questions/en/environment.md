---
title: "What is Environment in SwiftUI and how do you use it?"
category: swiftui
order: 14
---

`Environment` is a property wrapper that reads a value from the view's environment. The value is selected with a key path into `EnvironmentValues`. It is read-only; to set values, use the `environment(_:_:)` modifier.

```swift
@Environment(\.colorScheme) var colorScheme: ColorScheme
```

When the value changes, SwiftUI updates the parts of the view that depend on it. SwiftUI updates some values itself based on system settings, some can be overridden, and you can also define your own (via `EnvironmentKey` or the `Entry()` macro).

The environment can also distribute `@Observable` objects: put it in with `.environment(library)` and retrieve it with `@Environment(Library.self) private var library`. If the object is not in the environment, SwiftUI throws an exception; to get `nil` instead, request an optional type: `@Environment(Library.self) private var library: Library?`.
