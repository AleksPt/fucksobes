---
title: "Как перенести данные из одной области памяти в другую с помощью unsafe-концепций Swift?"
category: memory
order: 63
---

Для этого используют небезопасные указатели: `UnsafeMutablePointer<T>`, `UnsafeMutableRawPointer`, буферные варианты `UnsafeMutableBufferPointer` и вспомогательные функции. Ответственность за корректность и время жизни переходит к разработчику.

**Из стека в кучу:** выделить память под значение и инициализировать её копией.

```swift
var local = 42                                   // значение на стеке
let heap = UnsafeMutablePointer<Int>.allocate(capacity: 1)
heap.initialize(to: local)                        // копия в куче
heap.pointee = 43
heap.deinitialize(count: 1)
heap.deallocate()                                 // память нужно освободить вручную
```

**Временный указатель на существующее значение:** `withUnsafeMutablePointer(to: &local) { ptr in ... }` — указатель действует только внутри замыкания, выносить его нельзя.

**Копирование блоков:** `UnsafeMutableRawPointer.copyMemory(from:byteCount:)`, `UnsafeMutablePointer.moveInitialize(from:count:)` (переносит значения, оставляя источник неинициализированным), `withUnsafeBytes` для чтения байтов, `bindMemory(to:)` и `assumingMemoryBound(to:)` для интерпретации типа. Для передачи ссылки на объект в C-код и обратно есть `Unmanaged` (`passRetained`, `takeUnretainedValue`).

Правила: соблюдать выравнивание, инициализировать перед чтением, деинициализировать типы с ARC перед освобождением и не использовать указатель после `deallocate`.
