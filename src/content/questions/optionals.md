---
title: "Что такое optional? Как он устроен?"
category: swift
order: 15
---

Optional в Swift — это перечисление (enum), которое либо содержит значение, либо nil, чтобы указать на отсутствие значения

---

удобный механизм обработки ситуаций, когда значение переменной может отсутствовать

```swift
enum Optional<Wrapped> {
		case some(Wrapped)
		case none
}

// + force unwrapping
// + map — преобразовывает опционал, если он имеет значение, 
// или ничего не делать, если он пуст
// + flatMap помогает нам, когда мы хотим убрать 
// дополнительный уровень Optional’а
// + nil coalsesing
```

---

тип, который используется в Swift каждый раз при работе с необязательным значением

```swift
public enum Optional<Wrapped>: ExpressibleByNilLiteral {
	case none
	case some(Wrapped)
}
```
