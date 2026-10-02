---
title: "What do the ?, !, and ?? operators do?"
category: swift
order: 94
---

- `?` after a type (`String?`) declares an optional. After an expression (`user?.name`) it is optional chaining: if the value is `nil`, the whole chain returns `nil` instead of crashing.
- `!` is forced unwrapping: `name!` returns the value or causes a runtime error if it is `nil`. Also, `Type!` declares an implicitly unwrapped optional (for example, for an `IBOutlet`). Use `!` only when `nil` is impossible.
- `??` is the nil-coalescing operator: `name ?? "Guest"` returns the value if there is one, otherwise a default value. The right-hand side is evaluated lazily.

```swift
let city = user?.address?.city ?? "Unknown"
```

The safe ways to unwrap are `if let`, `guard let`, and `??`; use `!` with care.
