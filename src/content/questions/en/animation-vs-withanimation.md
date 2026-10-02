---
title: "What is the difference between .animation(_:value:) and withAnimation(_:_:)? How do you disable animation for a subview when animation is enabled for the parent View?"
category: swiftui
order: 50
---

Both approaches attach an animation to state changes, but they decide differently what to animate.

- **`.animation(_:value:)`** — a modifier on a specific view: it animates **any** change of the given `value` that affects this view and its descendants, regardless of where and how the value changed. It is tied to a place in the hierarchy.
- **`withAnimation(_:_:)`** — an imperative wrapper around a state change: it animates **all** UI changes that happen inside the closure, regardless of which views they belong to. It is tied to the moment of the change, not to a specific view.

```swift
// .animation — animates only this Text when isExpanded changes
Text("Details")
    .opacity(isExpanded ? 1 : 0)
    .animation(.easeInOut, value: isExpanded)

// withAnimation — animates all affected views at once
withAnimation(.easeInOut) {
    isExpanded.toggle()
}
```

To **disable** animation for a specific subview while the parent animates via `withAnimation`, attach `.animation(nil, value: ...)` to that subview (or, in newer versions of SwiftUI, `.transaction { $0.animation = nil }`):

```swift
VStack {
    HeaderView()          // animates together with the parent

    DetailView()
        .animation(nil, value: isExpanded) // animation is disabled only for this view
}
.animation(.easeInOut, value: isExpanded)
```

`.animation(nil, value:)` overrides the animation inherited from above only for changes tied to this particular `value` — the rest of the hierarchy and the root view keep animating as intended.
