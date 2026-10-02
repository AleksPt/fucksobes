---
title: "Can you store elements of different types in an array of Views using any View/AnyView?"
category: swiftui
order: 55
---

Not directly: `View` is a protocol with an associated type (`Body`), so it has no single concrete type, and the compiler won't accept an array like `[View]` — you need type erasure.

**Option 1 — `AnyView`:**

```swift
let views: [AnyView] = [
    AnyView(Text("First")),
    AnyView(Image(systemName: "star"))
]
```

`AnyView` erases the concrete view type at runtime. The downside is that SwiftUI loses its static diffing optimizations, which can hurt performance when updates are frequent.

**Option 2 — `any View` (an existential type, iOS 16+):**

```swift
let views: [any View] = [Text("First"), Image(systemName: "star")]
```

It looks similar, but the semantics differ: this is a Swift language existential container, not a dedicated SwiftUI wrapper.

In practice, `@ViewBuilder` with `TupleView`/`Group` is used more often, or `AnyView` when you really do need a heterogeneous array of views.
