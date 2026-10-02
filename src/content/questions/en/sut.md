---
title: "What is the object under test called?"
category: testing
order: 17
---

The object being tested is called the **SUT** (System Under Test); you may also see **CUT** (Class Under Test), or **DOC** for its dependencies (Depended-On Component). The SUT is whatever a particular test checks: a function, class or module. Everything it needs to work is its dependencies, which in a unit test are replaced with test doubles (stub, mock, spy, fake).

```swift
func testTotal() {
    let sut = Cart(items: [Item(price: 10), Item(price: 5)])   // SUT
    XCTAssertEqual(sut.total(), 15)
}
```

Naming the variable that holds the object under test `sut` has become the convention: it shows at a glance what exactly is being tested and makes tests look uniform.
