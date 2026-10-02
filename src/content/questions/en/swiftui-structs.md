---
title: "Why does SwiftUI use structs?"
category: swiftui
order: 3
---

A view in SwiftUI is declared as a struct that conforms to the `View` protocol: it is a lightweight description of the interface, not the object on screen itself. SwiftUI takes care of rendering and updating views in response to events and state changes, so when the input data changes it may recreate the struct at any moment, and you shouldn't do heavy work in a view's initializer.

Why structs specifically:

1. **Immutability and value semantics.** A copy of a struct is independent, so there are no unexpected side effects from shared mutable state, and data changes are easier to track.
2. **Performance.** Structs are cheap to create and destroy, they usually don't live on the heap, and they don't drag along an inheritance hierarchy the way class-based views do.
3. **Lower risk of retain cycles.** Value types have no reference counting, so views don't form ownership cycles (closures that capture reference objects still can).
