---
title: "When will the layout happen after setNeedsLayout?"
category: uikit
order: 40
---

`setNeedsLayout()` merely marks the view's layout as invalid and returns right away: the recalculation happens in the next update cycle, not at the moment of the call. Thanks to this, you can invalidate the layout of several views and handle it all in one cycle, which is usually better for performance. The method must be called on the main thread.

If layout is needed immediately, use `layoutIfNeeded()`: it lays out the subtree right away if there are pending updates, and does nothing if there are none.
