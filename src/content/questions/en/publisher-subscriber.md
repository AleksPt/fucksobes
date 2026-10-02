---
title: "What is Publisher/Subscriber?"
category: concurrency
order: 83
---

These are the main roles in the Combine framework. A `Publisher` is a source of values over time: it can emit zero or more values and finish with either success or an error. A `Subscriber` is a receiver that subscribes to a publisher and handles the values. A subscription (`Subscription`) links them and lets the receiver request values in batches (backpressure).

Operators (`map`, `filter`, `debounce`, `combineLatest`) are placed between the source and the receiver, and the standard subscribers are `sink` and `assign(to:on:)`. The subscription is returned as an `AnyCancellable`: while the object is stored, the subscription is active, and when it is released, the subscription is cancelled.

```swift
var cancellables = Set<AnyCancellable>()
[1, 2, 3].publisher
    .map { $0 * 2 }
    .sink { print($0) }
    .store(in: &cancellables)
```
