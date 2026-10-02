---
title: "How does Swift Concurrency interact with GCD and OperationQueue under the hood?"
category: concurrency
order: 114
---

Swift Concurrency **does not replace** GCD but is built on top of it: the task scheduler (Task scheduler) is built on `libdispatch`, the same library that is behind GCD.

How it works:

- `@MainActor` uses the **main dispatch queue**: code on the main actor runs on the main queue, just like ordinary GCD code on `DispatchQueue.main`;
- tasks not tied to a particular actor run on **global concurrent queues**, depending on priority, the same mechanism that underlies `DispatchQueue.global(qos:)`;
- each created `Task` goes to an **executor** associated with the cooperative thread pool: unlike plain GCD, the number of threads in this pool is limited by the number of cores on the device, so the system does not spawn threads uncontrollably.

An important practical rule follows from this: **mixing `DispatchQueue` directly inside a `Task` is not recommended**: it is allowed and works, but GCD knows nothing about the `Task` context (actor, priority, cancellation), which makes the code harder to maintain:

```swift
Task {
    await doWork()
    DispatchQueue.main.async {
        self.label.text = "Done" // ❌ works, but GCD and Concurrency are mixed
    }
}
```

The right way is to stay in the Swift Concurrency world and move to the main actor through `await`, not through GCD:

```swift
@MainActor
func updateUI() {
    self.label.text = "Done"
}

Task {
    await doWork()
    await updateUI() // ✅ a correct hop to MainActor
}
```

When this matters:

- when migrating old code with lots of `DispatchQueue.async` to `async/await`;
- when testing: some XCTest callbacks still run through GCD;
- when measuring performance: a `Task` can seem "slow" if it competes with GCD queues for the shared thread pool.

Best practice: in `async` code, avoid using `DispatchQueue` directly without an explicit need (for example, throttling or a specific QoS), and use `MainActor.run { }`/`await` transitions instead of `DispatchQueue.main.async`.
