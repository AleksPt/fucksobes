---
title: "What happens if you call setNeedsLayout() inside layoutSubviews()?"
category: uikit
order: 101
---

`setNeedsLayout()` marks the view's layout as outdated, and on the nearest pass of the run loop `layoutSubviews()` will be called again. If you do this inside `layoutSubviews()` itself, the view will constantly request another layout: you get a loop that burns CPU and can hang the interface.

```swift
override func layoutSubviews() {
    super.layoutSubviews()
    setNeedsLayout()      // don't do this: layout will be requested endlessly
}
```

A loop can also arise indirectly: for example, inside `layoutSubviews()` the size or text of a subview changes, and that invalidates the layout again. For constraints, UIKit has a safeguard: if the constraint update does not stabilize, an exception is thrown saying that the window requested an update too many times. For manual layout there is no such safeguard, so inside `layoutSubviews()` you should only place subviews and not change anything that initiates a new layout.
