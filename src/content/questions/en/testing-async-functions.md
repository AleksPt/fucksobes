---
title: "How do you correctly test async functions in XCTest? XCTestExpectation or async tests?"
category: testing
order: 21
---

Since Xcode 13 and Swift 5.5, test methods can be written as ordinary `async` functions. This is the main way to test `async` code without resorting to `XCTestExpectation`.

```swift
func testLoadData() async throws {
    let result = try await loadData()
    XCTAssertEqual(result.count, 3)
}
```

**When it's simple.** If the function under test returns an `async` value directly, the test is also written as `async throws`. No `XCTestExpectation` is needed: the `await` inside the test waits for the result itself, and XCTest handles a failure or timeout.

**When you still need `XCTestExpectation`.**

- when testing old code that has no `async` yet but uses callbacks;
- when you need to observe time-based events that aren't directly tied to the return of an `async` function: notifications, timers, external input.

Pitfalls of `async` tests:

- **implicit timeout**: if you forget an `await`, the test may hang until the overall test run timeout instead of failing right away with a clear reason;
- **`Task.cancel()` does not stop an `async` test on its own**: cancellation has to be checked and handled manually inside the code under test, otherwise the test keeps waiting for the result of the cancelled task.

How to test cancellation:

```swift
func testCancelTask() async throws {
    let task = Task {
        try await Task.sleep(nanoseconds: 1_000_000_000)
        return "Done"
    }

    task.cancel()

    do {
        _ = try await task.value
        XCTFail("Task should be cancelled")
    } catch {
        XCTAssertTrue(error is CancellationError)
    }
}
```

Best practices:

- use `async` tests as the primary approach for new `async` code;
- test an `AsyncSequence` with `for await`;
- when integrating with `Combine`, you can use `await publisher.values.prefix(...)` instead of a manual subscription and `XCTestExpectation`.
