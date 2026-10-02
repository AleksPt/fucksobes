---
title: "В чём разница между nil и .none?"
category: swift
order: 18
---

Для `Optional` никакой разницы нет: `nil` — это `.none`. Нюансы появляются в двух случаях:

- у вложенного опционала `Int??` `nil` означает внешний `.none`, а `.some(nil)` — это внешний `.some` с внутренним `nil`, поэтому он не равен `nil`;
- если у обёрнутого типа есть собственный кейс `.none`, то в контексте `E?` запись `.none` читается как `Optional.none` (компилятор предупреждает), а `E.none` — это `.some(.none)`.

```swift
let x: Int?? = .some(nil)
x == nil            // false

enum E { case none }
let a: E? = .none   // Optional.none, то есть nil
let b: E? = E.none  // .some(.none), не nil
```
