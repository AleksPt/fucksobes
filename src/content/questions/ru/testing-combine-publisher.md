---
title: "Как тестировать код, использующий Combine Publisher?"
category: testing
order: 22
---

Основная сложность — `Publisher` асинхронный, поэтому тест должен дождаться событий (`sink`) прежде чем делать проверки.

**Вариант 1 — через `XCTestExpectation`:**

```swift
func testPublisherEmitsValue() {
    let expectation = expectation(description: "получили значение")
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

**Вариант 2 — синхронно собрать значения через `collect`,** если поток конечный (например, оборачивает один сетевой запрос):

```swift
let values = try awaitPublisher(publisher) // самописный хелпер на expectation + timeout
```

Полезно держать `Set<AnyCancellable>` как свойство теста, чтобы подписка не была уничтожена ARC до срабатывания.

**Что важно проверять:**

- эмитит ли `Publisher` ожидаемое значение (`.sink(receiveValue:)`);
- корректно ли завершается (`.finished`) или падает с ошибкой (`.failure`) в `receiveCompletion`;
- сколько раз сработал publisher (не задублировались ли события).

Для полного контроля над временем часто используют `Scheduler` с тестовым `VirtualTimeScheduler` или явно передают `TestScheduler` вместо `DispatchQueue.main`, чтобы не зависеть от реальных задержек.
