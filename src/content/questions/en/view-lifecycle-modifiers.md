---
title: "Which modifiers react to View lifecycle events?"
category: swiftui
order: 40
---

SwiftUI has three main modifiers:

- `onAppear(perform:)` — runs an action when the view has appeared on screen; it is called on every appearance, not only the first;
- `onDisappear(perform:)` — runs an action when the view has disappeared;
- `task(priority:_:)` — starts an asynchronous (`async`) action on appearance and automatically cancels it when the view disappears.

```swift
List(items) { item in Text(item.name) }
    .onAppear { analytics.track("screen_opened") }
    .task { items = await api.loadItems() }        // cancelled when leaving the screen
    .onDisappear { analytics.track("screen_closed") }
```

The main difference between `task` and `onAppear`: work started in `onAppear` is not cancelled when leaving the screen (for async code you would have to create a `Task` manually and store it for cancellation), whereas `task` starts and stops together with the view. The `task(id:)` variant restarts the task when the `id` value changes. There is also `onChange(of:)` for reacting to a value change, and `scenePhase` for the state of the whole scene.
