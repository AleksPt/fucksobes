---
title: "Что такое UI-тесты? Для чего они нужны?"
category: testing
order: 7
---

UI-тесты запускают приложение и имитируют действия пользователя — касания, ввод текста, скролл, — проверяя видимые элементы и переходы между экранами. В iOS их пишут с XCUITest (`XCUIApplication`, `XCUIElement`), а находят элементы по `accessibilityIdentifier`.

```swift
let app = XCUIApplication()
app.launch()
app.textFields["email"].tap()
app.textFields["email"].typeText("a@b.com")
app.buttons["login"].tap()
XCTAssertTrue(app.staticTexts["welcome"].waitForExistence(timeout: 5))
```

Нужны, чтобы проверить ключевые пользовательские сценарии (вход, оплата, регистрация) целиком, то есть UI вместе с логикой и данными. Минусы: медленные, хрупкие (ломаются при изменении интерфейса) и зависят от окружения, поэтому покрывают только важные пути, а основную проверку оставляют unit-тестам. Для стабильности используют моковые данные и запуск приложения с тестовыми аргументами.
