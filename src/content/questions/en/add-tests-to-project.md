---
title: "How do you add tests to a project?"
category: testing
order: 16
---

In Xcode, tests live in a separate target:

1. **File → New → Target → Unit Testing Bundle** (for UI tests, UI Testing Bundle). When creating a new project, you can also check Include Tests.
2. Xcode creates a file with a subclass of `XCTestCase`. Methods whose names start with `test` are run as tests; `setUp()` and `tearDown()` run before and after each test.
3. `@testable import MyApp` gives access to the app's `internal` types.
4. To run: `Cmd+U` (all tests) or the button next to a test; from the command line, `xcodebuild test`.

```swift
import XCTest
@testable import MyApp

final class CartTests: XCTestCase {
    func testTotal() {
        let cart = Cart(items: [Item(price: 10), Item(price: 5)])
        XCTAssertEqual(cart.total(), 15)
    }
}
```

Instead of XCTest, you can use the Swift Testing framework: `import Testing`, the `@Test` attribute, and `#expect` checks. Test suites and run configurations are defined by a Test Plan.
