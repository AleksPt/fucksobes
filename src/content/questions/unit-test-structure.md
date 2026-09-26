---
title: "Назовите три основных блока unit-теста"
category: testing
order: 3
---

Обычно тест строят по схеме **Arrange–Act–Assert** (в BDD её называют Given–When–Then):

- **Arrange** (Given) — подготовка: создание тестируемого объекта, входных данных и подмена зависимостей;
- **Act** (When) — вызов тестируемого метода или действия;
- **Assert** (Then) — проверка, что результат или побочный эффект совпадает с ожидаемым.

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

Такая структура делает тест читаемым: один тест проверяет одно поведение и отвечает на вопрос, что подготовили, что сделали и что ожидали.
