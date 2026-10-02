---
title: "What does the .transition method do, and what must be taken into account for it to work?"
category: swiftui
order: 49
---

`.transition(_:)` describes **how exactly** a view should appear and disappear when it is inserted into or removed from the hierarchy (not how it looks statically). On its own, it animates nothing.

```swift
if isVisible {
    Text("Hello")
        .transition(.opacity.combined(with: .scale))
}
```

For the transition to actually play as an animation, several conditions must be met:

1. **The appearance/disappearance of the view itself** must result from a change in the hierarchy's structure — a conditional `if`/`switch` in a `@ViewBuilder`, or inserting/removing an element in a `ForEach` — rather than merely changing a property of an already existing view (that calls for `.animation`, not `.transition`).
2. The state change that causes the appearance/disappearance must happen **inside `withAnimation`** (or the view must have an active `.animation` modifier in effect at that moment) — without an animation context, SwiftUI applies the transition instantly, with no animation.
3. `.transition` must be attached to the view that appears/disappears itself (or to its parent, if a whole container is removed), not "from the outside" after the condition has already fired.

```swift
withAnimation {
    isVisible.toggle() // without withAnimation, the transition is applied without animation
}
```

Built-in transitions: `.opacity`, `.scale`, `.slide`, `.move(edge:)`, `.asymmetric(insertion:removal:)` — for different insertion and removal animations — and `.combined(with:)` to combine several. You can also write a fully custom transition via `AnyTransition` and `ViewModifier`.
