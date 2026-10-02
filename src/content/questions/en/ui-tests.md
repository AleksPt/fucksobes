---
title: "What are UI tests? What are they for?"
category: testing
order: 7
---

UI tests launch the app and simulate user actions (taps, text input, scrolling), checking visible elements and transitions between screens. In iOS they are written with XCUITest (`XCUIApplication`, `XCUIElement`), and elements are found by `accessibilityIdentifier`.

```swift
let app = XCUIApplication()
app.launch()
app.textFields["email"].tap()
app.textFields["email"].typeText("a@b.com")
app.buttons["login"].tap()
XCTAssertTrue(app.staticTexts["welcome"].waitForExistence(timeout: 5))
```

They are used to verify key user scenarios (sign-in, payment, registration) end to end, that is, the UI together with the logic and data. Cons: they are slow, brittle (they break when the interface changes) and depend on the environment, so they cover only the important paths and leave the main verification to unit tests. For stability, use mock data and launch the app with test arguments.
