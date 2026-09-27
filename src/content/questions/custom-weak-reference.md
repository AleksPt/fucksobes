---
title: "Как сделать кастомную weak-ссылку?"
category: memory
order: 79
---

`weak` — не просто модификатор, а встроенная в компилятор и рантайм функциональность (использует side table для zeroing weak references), поэтому создать *настоящий* `weak` вручную нельзя. Но можно написать обёртку, которая ведёт себя как слабая ссылка, используя уже существующий механизм ARC.

Самый простой способ — generic-класс с `weak`-свойством внутри:

```swift
final class Weak<T: AnyObject> {
    weak var value: T?

    init(_ value: T?) {
        self.value = value
    }
}
```

Такую обёртку удобно использовать, например, для хранения слабых ссылок в коллекциях — `Array`/`Dictionary` не умеют хранить `weak` напрямую:

```swift
var observers: [Weak<SomeObserver>] = []
observers.append(Weak(observer))

// при обращении объект мог уже быть освобождён
observers.compactMap { $0.value }.forEach { $0.notify() }
```

Есть и более низкоуровневый путь — через `Unmanaged`/`unsafeBitCast` работать напрямую с указателем без увеличения счётчика ссылок, но это `unsafe`-API: компилятор не гарантирует, что объект не будет освобождён и указатель не станет висячим (dangling pointer). Для обычных задач достаточно обёртки со свойством `weak`.
