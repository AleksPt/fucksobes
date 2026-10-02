---
title: "How does TaskGroup differ from AsyncStream/AsyncChannel, and when should you use which?"
category: concurrency
order: 112
---

Both tools are about parallel/asynchronous work with several values, but they solve different problems: `TaskGroup` is about running a known set of tasks in parallel, while `AsyncStream` is about a stream of values that appear over time.

**`TaskGroup`** (`withThrowingTaskGroup` and other variants) runs several child tasks in parallel and in a structured way: they are all bound to the parent task, are cancelled automatically if the parent finishes with an error, and the parent necessarily waits for them to finish before leaving the block.

```swift
func downloadAll(urls: [URL]) async throws -> [Data] {
    try await withThrowingTaskGroup(of: Data.self) { group in
        for url in urls {
            group.addTask { try await download(url) }
        }

        var result: [Data] = []
        for try await data in group { result.append(data) }
        return result
    }
}
```

It is suitable when the **number of tasks is known in advance** (for example, downloading N files) and a structured guarantee of cancellation and completion matters.

**`AsyncStream`** turns a source of values arriving "at different moments in time" (a timer, a delegate, a socket) into an `AsyncSequence` that is read with a `for await` loop. It is suitable when the **number of elements is not known in advance**: it is a stream, not a fixed set of tasks.

**`AsyncChannel`** (from `swift-async-algorithms`) is an extended version of the same principle with `send`/`receive` methods, supporting two-way interaction between the sender and the receiver, not just one-way broadcasting of values.

Quick comparison:

| | `TaskGroup` | `AsyncStream`/`AsyncChannel` |
|---|---|---|
| Number of tasks | known in advance | dynamic, streaming |
| Completion | controlled by the parent | the `continuation` finishes it manually |
| Cancellation | automatic, structured | must be implemented explicitly |
| Suited for | parallel computation | asynchronous events (incoming data) |

Summary: `TaskGroup` handles parallel computation with a known set of tasks and control over cancellation and errors; `AsyncStream`/`AsyncChannel` handle a reactive stream of values arriving over time in an unknown amount.
