---
title: "When does it make sense to combine async/await with Combine or RxSwift, and what are the pitfalls?"
category: concurrency
order: 117
---

Combining them makes sense not "permanently" but as a temporary or boundary bridge between the two models:

- **during a gradual migration**: old code or a library still uses `Combine`/`RxSwift`, while new APIs are already written with `async/await`, and rewriting everything at once is not possible;
- when you need a **reactive stream of values** (`Publisher`), but the values themselves arrive asynchronously from `async` functions;
- in UI scenarios where `@Published`, `ObservableObject`, and `Binding` are still based on Combine, while the business logic is already moving to `async/await`.

**From a `Publisher` to an `AsyncSequence`:**

```swift
let publisher: AnyPublisher<Int, Never> = ...

for await value in publisher.values {
    print("Received \(value)")
}
```

Swift provides `.values`, a ready-made Combine → `AsyncSequence` adapter.

**From `async` to a `Publisher`:**

```swift
func load() async -> Int { 42 }

func loadPublisher() -> AnyPublisher<Int, Never> {
    Future { promise in
        Task {
            let result = await load()
            promise(.success(result))
        }
    }.eraseToAnyPublisher()
}
```

Pitfalls:

- **Unnecessary wrapping.** A `Future → Task → await → Future` chain may be redundant if you can simply rewrite the calling code to use `async/await` entirely.
- **Errors and cancellation are handled differently.** `Combine` can end a stream through a subscription's `.cancel()`, while `Task.cancel()` follows different logic that needs separate cancellation handling inside the `Future`.
- **Retain cycles.** If `self` is used inside `Combine`/`Task`, it is easy to forget `weak self` and get a leak.
- **Mismatched consumption models.** `Combine` is a push model: the publisher sends values, and the subscriber limits their number through `Subscribers.Demand` (backpressure; `sink` and `assign` request unlimited demand). `AsyncSequence` is a pull model: the consumer requests the next value itself through `next()`. Moving between them requires care about exactly when the computation starts.

Best practices:

- for new logic, use `async/await` directly, without wrapping it in `Combine`;
- isolate the interaction between the two worlds in dedicated adapters (for example, `PublisherToAsyncSequenceAdapter`, `AsyncToPublisherBridge`) rather than spreading conversions throughout the code;
- do not do two-way conversions "on the fly" in the middle of business logic: it confuses debugging and call stack traces.
