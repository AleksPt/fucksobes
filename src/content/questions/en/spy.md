---
title: "What is a Spy?"
category: testing
order: 15
---

A Spy is a test double that is called in place of the real dependency and records how it was used: which methods were called, how many times and with which arguments. After the code runs, the test inspects the recorded data and makes the assertions itself.

```swift
protocol Analytics { func track(_ event: String) }

final class AnalyticsSpy: Analytics {
    private(set) var events: [String] = []
    func track(_ event: String) { events.append(event) }
}

func testLoginTracksEvent() {
    let spy = AnalyticsSpy()
    let sut = LoginViewModel(analytics: spy)
    sut.login()
    XCTAssertEqual(spy.events, ["login"])
}
```

The difference from a Mock: a Mock has its expectations set up in advance and verifies on its own that the interaction was correct, while a Spy only collects information and the assertions live in the test. The difference from a Stub: a Stub returns canned answers and remembers nothing. A Spy is used to make sure a side effect happened (analytics, logging, a service call).
