---
title: "What happens if you call layoutIfNeeded() again inside a layout pass?"
category: uikit
order: 102
---

`layoutIfNeeded()` performs layout immediately, but only if the view has been marked as needing it. If you call it from within a layout that is already in progress, the nested call usually does nothing: the view is already being processed at that moment and is not considered "dirty". But if you change some state inside the layout that makes another view require layout again, the nested `layoutIfNeeded()` will trigger it right away, and you get a recursive (re-entrant) layout.

Consequences: repeated work within a single pass, extra computation, a call order that is hard to debug, and a risk of infinite loops with mutual dependencies. Therefore:

- don't call `layoutIfNeeded()` inside `layoutSubviews()` and `viewDidLayoutSubviews()`;
- call it outside of layout: for example, in an animation block after changing constraints, to apply them synchronously;
- for a deferred recalculation, use `setNeedsLayout()`.
