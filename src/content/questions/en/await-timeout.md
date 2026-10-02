---
title: "How do you implement a timeout for an await expression (withTimeout), and what are the cancellation caveats?"
category: concurrency
order: 119
---

The problem: many `async` functions have no built-in timeout. They can run forever, for example if the server does not respond because of a network error, or because of a hanging bug.

The solution is to wrap the call in your own `withTimeout` function, which runs the main operation and a timer in parallel in a `TaskGroup` and takes the result of whichever finishes first:

```swift
enum TimeoutError: Error {
    case timedOut
}

func withTimeout<T>(
    seconds: Double,
    operation: @escaping @Sendable () async throws -> T
) async throws -> T {
    try await withThrowingTaskGroup(of: T.self) { group in
        group.addTask {
            return try await operation()
        }

        group.addTask {
            try await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
            throw TimeoutError.timedOut
        }

        let result = try await group.next()!
        group.cancelAll()
        return result
    }
}
```

How it works:

- two parallel tasks are created: the main operation and a timer;
- whichever is faster wins: `group.next()` returns the result of the first task to finish;
- the second (losing) task is cancelled via `group.cancelAll()` so it does not keep working for nothing.

Cancellation caveats:

- cancellation in `withTimeout` requires the inner operation to **respond to** `Task.isCancelled`: if it does not check for cancellation, `group.cancelAll()` only sets a flag and the work does not actually stop;
- if the inner operation is "stuck" inside a never-cancelling `await` (one that does not check for cancellation and does not support it natively), `withTimeout` still returns control when the timeout expires (the timeout itself fires), but the background task keeps running and does not release its resources until it finishes on its own.

Use with caution:

- for network operations, first try `URLSessionConfiguration.timeoutIntervalForRequest` if its semantics fit: it is a native request timeout with no extra wrapper;
- do not wrap every `await` in a timeout "just in case": it is expensive (an extra task and task group on every call);
- use `withTimeout` for external calls you do not control (third-party SDKs, I/O) where there is no built-in timeout and you cannot fix the underlying operation yourself.
