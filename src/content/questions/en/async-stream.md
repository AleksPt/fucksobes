---
title: "What is AsyncStream? Why is it needed?"
category: concurrency
order: 85
---

`AsyncStream` is a type that turns a source of values arriving "at different moments in time" (callbacks, delegates, notifications) into an `AsyncSequence`. It is consumed with a `for await` loop, so you can work with events in `async/await` style, without closures and subscriptions.

```swift
let stream = AsyncStream<Int> { continuation in
    let timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
        continuation.yield(Int.random(in: 0...9))
    }
    continuation.onTermination = { _ in timer.invalidate() }
}

for await value in stream { print(value) }
```

Values are sent through `continuation.yield`, and `finish()` ends the stream. Use `onTermination` to clean up resources: it is called when the stream finishes or is cancelled. `AsyncStream` cannot throw an error; for that there is `AsyncThrowingStream`. The consumer reads values one by one, and buffering is configured with the `bufferingPolicy` parameter.
