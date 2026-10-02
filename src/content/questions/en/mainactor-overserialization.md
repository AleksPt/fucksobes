---
title: "What should you keep in mind when using @MainActor, and how do you avoid \"over-serialization\"?"
category: concurrency
order: 120
---

`@MainActor` guarantees that the marked method, property, or entire type will run on the main queue (the main thread), and Swift automatically hops to `MainActor` if the call comes from outside its context. It is usually used to mark everything that updates the UI, the `@Published` properties of an `ObservableObject`, and `AppStorage`.

**Over-serialization** is an anti-pattern where `@MainActor` is put "on everything" in a type, even on heavy computations that have nothing to do with the UI. This turns the main thread into a bottleneck: any heavy operation inside a `@MainActor` type blocks not only the UI but all the other methods of that type, since they all run sequentially on the same actor.

```swift
@MainActor
func processData() async {
    // ❌ heavy computation on the main thread
    for _ in 0..<1_000_000 {
        _ = UUID().uuidString
    }
}
```

How to avoid it:

- **Move heavy work to the background** and return to the main actor only for the finished result:

```swift
func loadData() async {
    let data = await Task.detached { process() }.value
    await MainActor.run {
        self.result = data
    }
}
```

- **Use `@MainActor` selectively**, not on the whole type:
  - only for properties and functions that update the UI or state observed by an `ObservableObject`;
  - write the rest of the logic outside `MainActor` and hop to it manually only where it is really needed.

Best practices:

- keep UI-related work strictly in `@MainActor` methods, not everything indiscriminately;
- process data off the main queue and return only the finished result to the main actor;
- do not mark an entire `ViewModel` as `@MainActor` if you can isolate only its UI part and keep the heavy logic in a separate service that is not isolated to the main actor.

The right balance: `@MainActor` protects against races when updating the UI and simplifies code, but it should not become the place where all of the app's business logic runs.
