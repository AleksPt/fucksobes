---
title: "How do you test code that uses a Combine Publisher?"
category: testing
order: 22
---

The main difficulty is that a `Publisher` is asynchronous, so the test has to wait for the events (`sink`) before making assertions.

**Option 1: with `XCTestExpectation`:**

```swift
func testPublisherEmitsValue() {
    let expectation = expectation(description: "received a value")
    var result: Int?

    let cancellable = publisher.sink { value in
        result = value
        expectation.fulfill()
    }

    wait(for: [expectation], timeout: 1)
    XCTAssertEqual(result, 42)
    cancellable.cancel()
}
```

**Option 2: collect the values synchronously via `collect`,** if the stream is finite (for example, it wraps a single network request):

```swift
let values = try awaitPublisher(publisher) // custom helper built on an expectation + timeout
```

It helps to keep a `Set<AnyCancellable>` as a property of the test so the subscription isn't destroyed by ARC before it fires.

**What is worth checking:**

- whether the `Publisher` emits the expected value (`.sink(receiveValue:)`);
- whether it completes correctly (`.finished`) or fails with an error (`.failure`) in `receiveCompletion`;
- how many times the publisher fired (whether events got duplicated).

For full control over time, people often use a `Scheduler` with a test `VirtualTimeScheduler`, or explicitly pass a `TestScheduler` instead of `DispatchQueue.main`, so the test doesn't depend on real delays.
