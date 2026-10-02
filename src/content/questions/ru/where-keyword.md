---
title: "Зачем нужно ключевое слово where?"
category: swift
order: 145
---

`where` добавляет условие или ограничение. Основные применения:

- **Ограничения дженериков и протоколов:**

```swift
func firstDuplicate<T: Sequence>(_ s: T) -> T.Element? where T.Element: Hashable { ... }
func sum<C: Collection>(_ c: C) -> Int where C.Element == Int { c.reduce(0, +) }
```

- **Условные расширения и соответствия:** `extension Array where Element: Numeric { ... }`, `extension Box: Codable where T: Codable {}`.
- **Фильтр в `for`:** `for n in numbers where n % 2 == 0 { ... }`.
- **Условие в `switch`:** `case let x where x > 10:`; в `catch` — `catch let e as MyError where e.isRetryable`.
- **Дополнительные требования в протоколах:** `associatedtype Item where Item: Equatable`.

Так `where` позволяет описывать требования прямо в сигнатуре, делает код выразительнее и заменяет вложенные проверки `if` внутри циклов и `switch`.
