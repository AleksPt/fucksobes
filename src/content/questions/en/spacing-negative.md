---
title: "Can the spacing parameter of a VStack or HStack take a negative value? If so, what visual effect will it have on screen?"
category: swiftui
order: 43
---

Yes, the `spacing` of `VStack`/`HStack` (and of `LazyVStack`/`LazyHStack`) can be negative — the parameter is an ordinary `CGFloat?`, with no restriction on the sign.

By default, `spacing` sets the distance between neighboring child views along the stack's axis. With a negative value, neighboring elements don't move apart; they **move closer and overlap** — the more negative the value, the greater the overlap.

```swift
ZStack {} // for comparison — full overlap via ZStack

HStack(spacing: -20) {
    Circle().fill(.red)
    Circle().fill(.blue)
    Circle().fill(.green)
} // the circles partially overlap, like chat participants' avatars
```

The drawing order follows the order of elements in the stack: later elements end up on top of earlier ones. This trick is often used for a "stack" effect of avatars or cards, without resorting to manual positioning with `offset`.
