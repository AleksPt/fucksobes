---
title: "How do setNeedsLayout, layoutIfNeeded and layoutSubviews differ?"
category: uikit
order: 39
---

- **`setNeedsLayout`**: tells the system that the view needs to be redrawn asynchronously, in the next drawing cycle (sets a flag).
- **`layoutIfNeeded`**: if the flag is set, immediately runs layout of the view and its subviews, without waiting for the next drawing cycle.
- **`layoutSubviews`**: called by the system to recalculate the sizes of child views.
