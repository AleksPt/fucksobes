---
title: "What are first-class functions? Does Swift support them?"
category: swift
order: 137
---

First-class functions are functions that can be treated like ordinary values: assigned to variables and constants, passed as arguments, returned from other functions, and stored in collections. Swift supports this, even though it is not a purely functional language.

```swift
func double(_ x: Int) -> Int { x * 2 }

let f: (Int) -> Int = double            // assigned a function
[1, 2, 3].map(f)                        // passed as an argument [2, 4, 6]

func makeAdder(_ n: Int) -> (Int) -> Int {
    { $0 + n }                          // returned a function
}
```

A function type is written as `(Parameters) -> Result`. Closures, higher-order functions (`map`, `filter`, `reduce`), completion handlers, and function composition are built on this.
