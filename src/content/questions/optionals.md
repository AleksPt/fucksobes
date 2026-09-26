---
title: "Что такое optional? Как он устроен?"
category: swift
order: 15
---

`Optional` — тип, который Swift использует при каждой работе с необязательным значением. Это удобный механизм для случаев, когда значение переменной может отсутствовать. Устроен как перечисление (`enum`): содержит либо значение, либо `nil`.

```swift
public enum Optional<Wrapped>: ExpressibleByNilLiteral {
    case none
    case some(Wrapped)
}
```

Работа с опционалами:

- force unwrapping;
- `map` — преобразует опционал, если в нём есть значение, а если он пуст — ничего не делает;
- `flatMap` — помогает убрать дополнительный уровень `Optional`;
- nil coalescing (`??`).
