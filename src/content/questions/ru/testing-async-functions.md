---
title: "Как корректно тестировать async-функции в XCTest? XCTestExpectation или async-тесты?"
category: testing
order: 21
---

С Xcode 13+ и Swift 5.5 тестовые методы можно писать как обычные `async`-функции — это основной способ тестировать `async`-код, не прибегая к `XCTestExpectation`.

```swift
func testLoadData() async throws {
    let result = try await loadData()
    XCTAssertEqual(result.count, 3)
}
```

**Когда всё просто.** Если тестируемая функция возвращает `async`-значение напрямую — тест тоже пишут как `async throws`. Никакого `XCTestExpectation` не нужно: `await` внутри теста сам дожидается результата, а сбой или таймаут теста обрабатывает XCTest.

**Когда всё же нужен `XCTestExpectation`.**

- при тестировании старого кода, где ещё нет `async`, но есть колбэки;
- когда нужно отслеживать события по времени, не привязанные напрямую к возврату из `async`-функции: уведомления, таймеры, внешний ввод.

Подводные камни `async`-тестов:

- **неявный timeout** — если забыть `await`, тест может зависнуть до общего таймаута тестового рана, а не упасть сразу с понятной причиной;
- **`Task.cancel()` не останавливает выполнение `async`-теста сам по себе** — отмену нужно проверять и обрабатывать вручную внутри тестируемого кода, иначе тест продолжит ждать результат отменённой задачи.

Как тестировать отмену:

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

- использовать `async`-тесты как основной подход для нового `async`-кода;
- для `AsyncSequence` тестировать через `for await`;
- при интеграции с `Combine` можно использовать `await publisher.values.prefix(...)` вместо ручной подписки и `XCTestExpectation`.
