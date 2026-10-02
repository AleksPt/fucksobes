---
title: "Как реализовать Message dispatch на практике?"
category: swift
order: 79
---

Пометить член класса модификатором `dynamic` вместе с `@objc`: доступ к нему всегда идёт через Objective-C runtime и никогда не инлайнится и не девиртуализируется.

```swift
class Base: NSObject {
    @objc dynamic func greet() -> String { "base" }
}
```

Так вызов `greet()` компилируется в `objc_msgSend`, а реализацию можно искать по селектору, например через `perform(_:)`.
