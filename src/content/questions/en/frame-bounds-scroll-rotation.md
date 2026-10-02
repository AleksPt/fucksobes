---
title: "Frame vs bounds: what is the difference? What changes when, say, scrolling? How does the frame change when rotating via a transform?"
category: uikit
order: 10
---

- `frame` describes the position and size of a `UIView` in the coordinate system of its superview.
- `bounds` describes its own internal coordinate system.

When scrolling, `bounds` changes, because the position of the content inside the view changes.

When rotating via `transform`, `frame` changes: it reflects the new extent, because it depends on the view's current size and position in the superview's space. `bounds` usually stays the same.
