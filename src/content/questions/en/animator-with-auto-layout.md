---
title: "How does UIViewPropertyAnimator work with Auto Layout animations?"
category: uikit
order: 112
---

Constraints are not animated by themselves: changing a `constant` or `isActive` only marks the layout as outdated. To get an animation, you have to force the layout to run inside the animation block by calling `layoutIfNeeded()` on the common parent.

```swift
heightConstraint.constant = 200          // 1. change the constraints before the animation

let animator = UIViewPropertyAnimator(duration: 0.3, curve: .easeInOut) {
    self.view.layoutIfNeeded()           // 2. the layout runs inside the block, so it is animated
}
animator.startAnimation()
```

Change the constraints before creating the block, and call `layoutIfNeeded()` on the view that contains all the subviews being changed (usually the controller's `view`); otherwise only part of the hierarchy will be animated. The animator supports pausing, scrubbing (`fractionComplete`), reversing and interrupting, which is handy for interactive transitions. The older API equivalent is `UIView.animate(withDuration:)` with the same `layoutIfNeeded()` inside.
