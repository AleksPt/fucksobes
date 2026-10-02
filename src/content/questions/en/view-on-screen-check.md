---
title: "How do you check that a view is shown on screen? How do you find out that it was added to the screen or removed?"
category: uikit
order: 124
---

A sign that a view is in a window's hierarchy is `view.window != nil`. When `window` is `nil`, the view has not yet been added or has already been removed from the hierarchy.

The `UIView` methods help track the moment of addition and removal:

- `willMove(toWindow:)` and `didMoveToWindow()`: the view is added to or removed from a window (in `didMoveToWindow` you check `window`);
- `willMove(toSuperview:)` and `didMoveToSuperview()`: a change of parent.

```swift
override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil { startAnimating() } else { stopAnimating() }
}
```

Keep in mind that `window != nil` does not mean the view is visible to the user: it may be hidden (`isHidden`, `alpha == 0`), covered by another view, or lie outside its parent's bounds. For visibility, you additionally check those properties and the intersection of the frame (in window coordinates) with the window's bounds. For a controller, use the appearance events `viewIsAppearing`, `viewDidAppear` and `viewDidDisappear`, as well as the check `isViewLoaded && view.window != nil`.
