---
title: "We have a view and we are animating it. It moves from one edge of the screen to the other. Can we somehow get the view's current frame values while the animation is running?"
category: uikit
order: 18
---

Yes:

1. Use `presentation()`: it gives access to the `CALayer`'s real-time state (the presentation layer is updated on every frame).
2. For continuous tracking, use `CADisplayLink`: it lets you run code on every animation frame, including reading the presentation layer in real time.

```swift
if let currentFrame = view.layer.presentation()?.frame {
    print("Current frame: \(currentFrame)")
}
```
