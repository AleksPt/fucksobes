---
title: "Can a function be the return value of another function?"
category: swift
order: 152
---

Yes. In Swift, functions are first-class values, so a function can be returned from another function regardless of whether it has parameters. The restriction "only if the function has no parameters" is incorrect.

```swift
func makeAdder(_ n: Int) -> (Int) -> Int {
    return { $0 + n }
}

let addFive = makeAdder(5)
addFive(3) // 8
```

The returned function can capture values from the outer one (see closures), which is why this is used for behavior factories, currying, and higher-order functions. If the returned closure is stored somewhere and outlives the call, it is considered escaping, but you don't need to specify this for a return value: the type `(Int) -> Int` already implies such behavior.
