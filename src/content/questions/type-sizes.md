---
title: "Какой размер у value и reference типов?"
category: memory
order: 10
---

Размер задаёт `MemoryLayout<T>`: `size` — сколько байт занимает значение, `stride` — расстояние между соседними экземплярами в памяти (кратно `alignment`), `alignment` — требуемое выравнивание. Для расчётов размещения в памяти Apple рекомендует использовать `stride`, а не `size`.

```swift
struct Point {
    let x: Double
    let y: Double
    let isFilled: Bool
}

class C { var a = 0 }

MemoryLayout<Point>.size      // 17
MemoryLayout<Point>.stride    // 24
MemoryLayout<Point>.alignment // 8
MemoryLayout<C>.size          // 8 (размер ссылки на экземпляр)
```

Value-тип занимает столько, сколько его поля. Для reference-типа `MemoryLayout<C>` описывает ссылку (на 64-битной платформе — 8 байт), а не размер самого экземпляра.

