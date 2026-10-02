---
title: "What is the difference between throws and rethrows in Swift?"
category: swift
order: 154
---

Both keywords mark a function as one that can throw an error, but with a different source of that error.

- **`throws`** — the function itself can throw an error in its body, regardless of whether it takes closure parameters or not.
- **`rethrows`** — the function does not throw errors itself but only **rethrows** an error thrown by a closure passed to it. If none of the closure parameters is marked `throws`, the call to such a function does not need to be wrapped in `try`.

```swift
func execute(_ operation: () throws -> Void) rethrows {
    try operation()
}

// A call with a closure that cannot throw — try is not needed
execute { print("ok") }

// A call with a throwing closure — try is required
try execute { throw MyError.failed }
```

The compiler checks this at compile time: a function with `rethrows` must take at least one parameter of a `throws` closure type, otherwise the declaration will not compile.

Error handling is the same in both cases — through `do-catch`:

```swift
do {
    try execute { throw MyError.failed }
} catch {
    print("Caught: \(error)")
}
```

`rethrows` is common in higher-order functions of the standard library — for example, `map`, `filter`, `forEach` — so as not to force the calling code to write `try` if the closure passed in does not throw.
