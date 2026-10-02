---
title: "When can you use drawRect (draw(_:)), and when not?"
category: uikit
order: 143
---

`draw(_:)` (`drawRect`) is for custom drawing of a view with Core Graphics: non-standard shapes, graphs, charts, and complex gradients and patterns that cannot be assembled from ready-made views and layers.

How it works: if a view overrides `draw(_:)`, a backing store (a bitmap in memory) is created for it, the content is drawn on the CPU and then composited by the GPU. Redrawing is triggered through `setNeedsDisplay()`; you do not call the method directly.

When not to use it:

- for simple elements (a colored background, rounded corners, a border, images, a gradient) that `backgroundColor`, `CAGradientLayer`, `CAShapeLayer` and similar layers can produce: they are drawn on the GPU and need no backing store;
- with frequent redrawing and animations: every redraw happens on the CPU and costs memory (view size × scale²) and time;
- an empty `draw(_:)` implementation "just in case" is harmful: the system will still allocate a backing store.

It is better to animate layer properties (they run in the render server) and use `draw(_:)` sparingly, limiting the redraw region (`setNeedsDisplay(_:)` with a `rect`).
