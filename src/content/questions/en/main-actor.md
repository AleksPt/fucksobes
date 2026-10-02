---
title: "How do you restrict a function to the main thread with Swift Concurrency?"
category: concurrency
order: 77
---

Mark the function with the `@MainActor` attribute: it will run only on the main actor. From code on the main actor it can be called synchronously, and from any other context only through `await`, because the transition to the main actor is a potential suspension point.

```swift
@MainActor
func show(_: Data) {
    // ... UI code to display the photo ...
}

func downloadAndShowPhoto(named name: String) async {
    let photo = await downloadPhoto(named: name)
    await show(photo)
}
```

A closure is marked like this: `Task { @MainActor in show(photo) }`. The attribute can also be placed on a struct, class, or enum: then all their methods and property access run on the main actor. The main actor is closely tied to the main thread: code on the main actor runs on the main thread.
