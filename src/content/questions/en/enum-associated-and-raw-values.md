---
title: "Can an enum have both an associated value and a rawValue?"
category: swift
order: 49
---

No. The enum syntax allows two different variants: cases with associated values, or cases with raw values of a single type. They cannot be used together: the compiler reports the error `enum with raw type cannot have cases with arguments`.

A raw value is set at declaration time and is always the same for a given case (the type can be a string, character, integer, or floating-point number; the values are unique). An associated value is chosen when an instance of the case is created and can be different every time.

```swift
enum Barcode {              // associated values
    case upc(Int, Int, Int, Int)
    case qrCode(String)
}

enum Planet: Int {          // raw values
    case mercury = 1, venus, earth
}
```
