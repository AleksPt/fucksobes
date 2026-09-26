---
title: "Может ли enum иметь одновременно ассоциированное значение и rawValue"
category: swift
order: 49
---

Нет. Синтаксис перечисления допускает два разных варианта: cases со связанными значениями (associated values) либо cases с raw-значениями одного типа. Вместе их использовать нельзя: компилятор выдаёт ошибку `enum with raw type cannot have cases with arguments`.

Raw-значение задаётся при объявлении case и для конкретного case всегда одинаково (тип: строка, символ, целое или число с плавающей точкой; значения уникальны). Связанное значение выбирается при создании экземпляра case и может быть каждый раз разным.

```swift
enum Barcode {              // associated values
    case upc(Int, Int, Int, Int)
    case qrCode(String)
}

enum Planet: Int {          // raw values
    case mercury = 1, venus, earth
}
```
