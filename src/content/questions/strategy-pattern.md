---
title: "Что такое паттерн «Стратегия» (Strategy)?"
category: architecture
order: 50
---

Strategy — поведенческий паттерн: набор взаимозаменяемых алгоритмов выносится в отдельные типы с общим интерфейсом, а объект-контекст хранит текущую стратегию и делегирует ей работу. Так алгоритм можно менять без изменения кода контекста, в том числе во время выполнения.

```swift
protocol DiscountStrategy { func apply(to price: Decimal) -> Decimal }

struct NoDiscount: DiscountStrategy { func apply(to price: Decimal) -> Decimal { price } }
struct PercentDiscount: DiscountStrategy {
    let percent: Decimal
    func apply(to price: Decimal) -> Decimal { price * (1 - percent / 100) }
}

struct Cart {
    var strategy: DiscountStrategy
    func total(_ price: Decimal) -> Decimal { strategy.apply(to: price) }
}
```

Плюсы: убирает длинные `if-else` и `switch` по типам, следует принципу открытости/закрытости, упрощает тестирование. Минусы: больше типов, клиент должен знать, какую стратегию выбрать. В Swift стратегией может быть и замыкание (`(Decimal) -> Decimal`). Примеры: способы оплаты, сортировка, валидация, форматирование.
