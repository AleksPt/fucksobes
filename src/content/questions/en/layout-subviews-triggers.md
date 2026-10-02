---
title: "What triggers layoutSubviews?"
category: uikit
order: 138
---

`layoutSubviews()` is called by the system when a view needs its layout recalculated. The main causes:

- a change of the view's `bounds` size (when `frame.size` changes, on device rotation, on a window mode change, on a trait collection change); a change of only the `origin` does not trigger layout;
- adding or removing a subview (`addSubview`, `removeFromSuperview`);
- a call to `setNeedsLayout()` (layout runs on the nearest run loop pass) or `layoutIfNeeded()`, if layout was requested;
- a change in constraints (`constant`, `isActive`, priority) and in a view's `intrinsicContentSize`, if layout goes through Auto Layout;
- scrolling a `UIScrollView`: a change of `contentOffset` triggers `layoutSubviews` of the scroll view itself (for lazy loading of cells);
- the view's initial display and its first addition to a window.

`layoutSubviews()` is called only by the system and by `layoutIfNeeded()`: direct calls are not allowed. Inside the method you must not change anything that triggers layout again, otherwise a loop is possible.
