---
title: "What is the difference between Int and UInt?"
category: swift
order: 129
---

`Int` is a signed integer, `UInt` is unsigned. The bit width depends on the platform (64 bits on 64-bit systems), and the fixed-width variants are `Int8`, `Int16`, `Int32`, `Int64` and their `UInt` counterparts.

- Signed `Int` has a range from `−2^(n−1)` to `2^(n−1)−1` (for 64 bits, roughly ±9.2·10¹⁸).
- Unsigned `UInt` has a range from `0` to `2^n−1`, with no negative values.

```swift
let a: UInt = 3
let b: UInt = 5
a - b            // runtime error: the result is negative, overflow
```

In Swift, `Int` is used by default for ordinary integers, even when the value is never negative (for example, `array.count` returns `Int`). This simplifies arithmetic and avoids conversions: Swift does not convert numeric types implicitly, so mixing `Int` and `UInt` requires explicit `Int(x)`/`UInt(x)`. `UInt` is used when the value is genuinely unsigned by nature (bit masks, data sizes, integration with C APIs).
