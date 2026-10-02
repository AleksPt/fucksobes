---
title: "Which Swift Concurrency tool can you use to load several items in parallel when the exact number of items is not known in advance?"
category: concurrency
order: 78
---

A task group: `withTaskGroup(of:returning:body:)` (or `withThrowingTaskGroup` if the tasks throw errors). It opens a scope with a dynamic number of child tasks: in a loop you call `group.addTask { ... }` for each item, and collect the results with `for await`.

```swift
func loadAll(_ urls: [URL]) async -> [Data] {
    await withTaskGroup(of: Data?.self) { group in
        for url in urls {
            group.addTask { try? await URLSession.shared.data(from: url).0 }
        }
        var result: [Data] = []
        for await data in group {
            if let data { result.append(data) }
        }
        return result
    }
}
```

Tasks run concurrently and can finish in any order; `withTaskGroup` returns only after all child tasks have finished. `cancelAll()` signals cancellation, but tasks must respond to it cooperatively.
