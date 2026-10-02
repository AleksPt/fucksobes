---
title: "Name the three main blocks of a unit test"
category: testing
order: 3
---

A test is usually built on the **Arrange–Act–Assert** pattern (in BDD it is called Given–When–Then):

- **Arrange** (Given): preparation: creating the object under test and the input data, and replacing dependencies;
- **Act** (When): calling the method or action under test;
- **Assert** (Then): checking that the result or side effect matches what is expected.

```swift
func testSumOfPrices() {
    // Arrange
    let cart = Cart(items: [Item(price: 10), Item(price: 5)])
    // Act
    let total = cart.total()
    // Assert
    XCTAssertEqual(total, 15)
}
```

This structure keeps the test readable: one test checks one behavior and answers the questions of what was set up, what was done and what was expected.
