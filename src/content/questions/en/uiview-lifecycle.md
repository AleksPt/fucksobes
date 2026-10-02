---
title: "What is the life cycle of a UIView?"
category: uikit
order: 152
---

Unlike `UIViewController`, `UIView` does not have a single fixed set of methods guaranteed to be called in order, but there are key points that any view passes through from creation to removal.

1. **Initialization.** `init(frame:)` when created in code, or `init(coder:)` when loaded from a xib/storyboard. This is where you set up whatever does not depend on the view's final size.
2. **Appearing in the hierarchy.** `willMove(toSuperview:)` is called before being added to or removed from the parent, and `didMoveToSuperview()` right after. Likewise for the window: `willMove(toWindow:)` and `didMoveToWindow()`; here it is convenient, for example, to start or stop animations depending on whether the view is on screen.
3. **Layout.** When the size or position may change, the system (or a call to `setNeedsLayout()`) marks the view as needing layout and then calls `layoutSubviews()`; this is where you position subviews manually if Auto Layout is not used, or override behavior on top of constraints.
4. **Drawing.** `draw(_ rect: CGRect)` is called when the view needs to draw itself manually via Core Graphics (override it only if you do custom drawing; for ordinary views that rely on layers and standard components, don't touch the method). Before that, you can call `setNeedsDisplay()` to request a redraw.
5. **Removal.** `removeFromSuperview()` takes the view out of the hierarchy and triggers `willMove(toSuperview: nil)`/`didMoveToSuperview()`. If nobody else holds a strong reference to the view, it is released and `deinit` is called.

```swift
final class BadgeView: UIView {
    override func didMoveToSuperview() {
        super.didMoveToSuperview()
        // A convenient place to learn that the view was added to the hierarchy
        startPulseAnimation()
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        layer.cornerRadius = bounds.height / 2
    }
}
```

The key difference from the controller lifecycle: a view has no separate "will/did appear" on the user's screen; if needed, the owning `UIViewController` keeps track of that, while the view itself reacts only to changes in the hierarchy, in size and in the need to redraw.
