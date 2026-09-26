---
title: "Как добавить тесты в проект?"
category: testing
order: 16
---

В Xcode тесты живут в отдельной цели (target):

1. **File → New → Target → Unit Testing Bundle** (для UI-тестов — UI Testing Bundle). При создании нового проекта можно поставить галочку Include Tests.
2. Xcode создаёт файл с классом-наследником `XCTestCase`. Методы, имена которых начинаются с `test`, запускаются как тесты; `setUp()` и `tearDown()` выполняются до и после каждого теста.
3. Доступ к внутренним (`internal`) типам приложения даёт `@testable import MyApp`.
4. Запуск: `Cmd+U` (все тесты) или кнопка рядом с тестом; в командной строке `xcodebuild test`.

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

Вместо XCTest можно использовать фреймворк Swift Testing: `import Testing`, атрибут `@Test` и проверки `#expect`. Наборы тестов и конфигурации запуска задаёт Test Plan.
