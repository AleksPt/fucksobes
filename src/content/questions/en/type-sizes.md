---
title: "What is the size of value and reference types?"
category: memory
order: 10
---

Size is given by `MemoryLayout<T>`: `size` is how many bytes the value occupies, `stride` is the distance between adjacent instances in memory (a multiple of `alignment`), and `alignment` is the required alignment. For memory layout calculations, Apple recommends using `stride` rather than `size`.

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
MemoryLayout<C>.size          // 8 (the size of a reference to an instance)
```

A value type takes as much as its fields do. For a reference type, `MemoryLayout<C>` describes the reference (8 bytes on a 64-bit platform), not the size of the instance itself.

