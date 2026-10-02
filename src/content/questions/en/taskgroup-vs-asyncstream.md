---
title: "How does TaskGroup differ from AsyncStream/AsyncChannel, and when should you use which?"
category: concurrency
order: 112
---

Both tools are about parallel/asynchronous work with several values, but they solve different problems: `TaskGroup` is about running a set of child tasks in parallel that you start yourself and whose results you wait for, while `AsyncStream` is about a stream of values that appear over time from an external source.

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

Tasks are added dynamically, so their number can be anything, including unknown in advance (for example, downloading every file from a list). It is suitable when you need parallel work that you start yourself and a structured guarantee of cancellation and completion.

**`AsyncStream`** turns a source of values arriving "at different moments in time" (a timer, a delegate, a socket) into an `AsyncSequence` that is read with a `for await` loop. It is suitable when values **arrive from outside at arbitrary moments** and it is unknown how many there will be: it is a stream of events, not a set of tasks you started.

**`AsyncChannel`** (from `swift-async-algorithms`) is an extended version of the same principle with `send`/`receive` methods, supporting two-way interaction between the sender and the receiver, not just one-way broadcasting of values.

Quick comparison:

| | `TaskGroup` | `AsyncStream`/`AsyncChannel` |
|---|---|---|
| Source of values | child tasks that you start | external events that arrive on their own |
| Completion | controlled by the parent | the `continuation` finishes it manually |
| Cancellation | automatic, structured | must be implemented explicitly |
| Suited for | parallel computation | asynchronous events (incoming data) |

Summary: `TaskGroup` handles parallel computation from tasks you start, with control over cancellation and errors; `AsyncStream`/`AsyncChannel` handle a reactive stream of values arriving from outside over time.
