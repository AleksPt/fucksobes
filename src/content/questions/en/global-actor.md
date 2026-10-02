---
title: "What are globalActor and @MainActor? What are they used for?"
category: concurrency
order: 86
---

A global actor is a singleton actor that can be applied to types and functions with an attribute: everything marked with it runs isolated on that actor. It is declared with the `@globalActor` attribute and a `static let shared`:

```swift
@globalActor
actor DatabaseActor {
    static let shared = DatabaseActor()
}

@DatabaseActor
func save() { ... }
```

`@MainActor` is a built-in global actor that runs code on the main thread. It is used to mark functions, properties, classes, and protocols that work with the UI (`UIViewController` and `View` are already isolated to it). Accessing such code from another context requires `await`. To perform a call on the main actor inside an asynchronous function, use `await MainActor.run { ... }`. This way the compiler checks that shared state is accessed from the right context and prevents data races.
