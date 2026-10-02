---
title: "Which UIView methods are involved in the layout process?"
category: uikit
order: 37
---

`setNeedsLayout()`, `layoutIfNeeded()`, `layoutSubviews()`

Layout runs in three phases per pass of the run loop:

1. **Updating constraints** (`updateConstraints`, if requested via `setNeedsUpdateConstraints()`): constraints are updated bottom-up through the hierarchy.
2. **Layout** (`layoutSubviews`): the subviews' `frame`s are computed and set top-down. It is requested by `setNeedsLayout()` (deferred, to the next pass), while `layoutIfNeeded()` performs it immediately if it is needed. You do not call `layoutSubviews()` directly.
3. **Drawing** (`draw(_:)`, if requested via `setNeedsDisplay()`).
