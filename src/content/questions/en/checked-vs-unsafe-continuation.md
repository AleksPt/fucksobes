---
title: "How do CheckedContinuation and UnsafeContinuation work, and when should you use them manually?"
category: concurrency
order: 110
---

`CheckedContinuation<T, E>` and `UnsafeContinuation<T, E>` are a low-level bridge between the asynchronous world (`async/await`) and callback-based APIs. Both let you manually suspend an `async` function and resume it later from an arbitrary place, for example from a delegate or the completion handler of an old API.

You get them through `withCheckedContinuation`/`withCheckedThrowingContinuation` and `withUnsafeContinuation`/`withUnsafeThrowingContinuation`: Swift suspends execution and hands you a `continuation`, which must be called **exactly once** to resume.

```swift
func loadData() async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        legacyAPI { data, error in
            if let data {
                continuation.resume(returning: data)
            } else {
                continuation.resume(throwing: error ?? MyError.unknown)
            }
        }
    }
}
```

The difference between them:

- **`CheckedContinuation`** performs runtime checks: it calls `preconditionFailure` if the `continuation` was never called (the task would hang forever), and it tracks repeated calls, crashing the app if `resume` is called more than once.
- **`UnsafeContinuation`** has no such checks. It is faster but more dangerous: a forgotten `resume()` call silently hangs the task forever, and a double call leads to undefined behavior with no clear error message.

When to use them: `CheckedContinuation` is the main choice for integrating with callback-based APIs and for debugging while you are not sure the wrapping is correct. `UnsafeContinuation` is justified only on a hot path where maximum performance is needed and it is already **definitively proven** that `resume()` is called exactly once.
