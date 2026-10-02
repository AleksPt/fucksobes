---
title: "What is the Strategy pattern?"
category: architecture
order: 50
---

Strategy is a behavioral pattern: a set of interchangeable algorithms is extracted into separate types with a common interface, and the context object holds the current strategy and delegates the work to it. This way the algorithm can be changed without changing the context's code, including at runtime.

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

Pros: it removes long `if-else` chains and `switch` statements on types, follows the open/closed principle, and simplifies testing. Cons: more types, and the client has to know which strategy to choose. In Swift, a strategy can also be a closure (`(Decimal) -> Decimal`). Examples: payment methods, sorting, validation, formatting.
