---
title: "Can you swap two variables without a third helper variable?"
category: swift
order: 119
---

Yes. In Swift, a tuple is enough:

```swift
var a = 1
var b = 2
(a, b) = (b, a)     // a == 2, b == 1
```

On the right, a tuple of the current values is created, and on the left it is destructured and the values are assigned to the variables. The same result is given by the standard library function `swap(&a, &b)`, which also works with collection elements (`arr.swapAt(0, 1)`).

The well-known "tricks" without a temporary variable — addition and subtraction, or `XOR` — are not needed in Swift, and the first of them can cause an `Int` overflow and a crash (Swift arithmetic checks for overflow).
