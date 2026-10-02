---
title: "What are Single, Completable, Maybe, and Driver in RxSwift?"
category: concurrency
order: 93
---

Besides the regular `Observable`, RxSwift has traits: narrower sequences with a clear contract.

- **Single** emits exactly one element and completes: `.success(value)` or `.failure(error)`. Suitable for a request with a single result.
- **Completable** emits no values and only completes: `.completed` or `.error`. Suitable for operations with no result (saving, deleting).
- **Maybe** emits either one element (`.success`), or completes without a value (`.completed`), or an error. It combines Single and Completable.

RxCocoa traits for the UI:

- **Driver** (`SharedSequence`) guarantees: no errors (when converting from an `Observable`, you provide a fallback value for the error case: `asDriver(onErrorJustReturn:)`), events arrive on the main thread, and the stream is shared between subscribers and replays the latest value to a new one (`share(replay: 1, scope: .whileConnected)`). You subscribe to it with `drive`.
- **Signal** is like Driver, but without replaying the latest value (for events, such as taps).

Driver is convenient for binding a ViewModel's data to UI elements: you don't have to think about errors and threads.
