---
title: "What is Future/Promise?"
category: concurrency
order: 82
---

Future and Promise are two related concepts for working with a result that will appear later. A Promise is the "promise" through which the producer writes the result (or an error) once; a Future is the "reading" side, an object that represents a value that is not ready yet. The subscriber receives the result when it is set and does not block a thread while waiting.

In Combine this is `Future<Output, Failure>`: it takes a closure with a `promise`, calls it once, and then emits a single value or an error.

```swift
let future = Future<Int, Never> { promise in
    DispatchQueue.global().async { promise(.success(42)) }
}
```

A Future starts working immediately on creation (not on subscription) and caches the result for all subscribers. In modern Swift the same task is solved by `async/await` and `withCheckedContinuation`. In other libraries (for example, PromiseKit), `Promise` and `Future` may refer to the same type.
