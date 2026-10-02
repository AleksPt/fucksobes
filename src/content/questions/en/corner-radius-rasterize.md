---
title: "How do you optimize cornerRadius? Does shouldRasterize work for dynamic views?"
category: uikit
order: 144
---

**cornerRadius.** The `layer.cornerRadius` property itself is cheap: you can round the layer's background and border without any problems. The problem appears with `layer.masksToBounds = true` (or `clipsToBounds`) on a view that has content (sublayers, images, many subviews): to clip to the rounded shape, the system renders the layer offscreen (offscreen rendering) and then applies a mask, which is expensive while scrolling, especially in cells.

How to optimize:

- don't use `masksToBounds` unless necessary; for the background, `cornerRadius` without clipping the content is enough;
- round images ahead of time (on load or when caching) and show the ready-made picture;
- draw the rounding with a `CAShapeLayer` or Core Graphics, and use `cornerCurve` for "smooth" corners;
- overlay corner pieces in the opaque background color on top to round visually;
- check in the simulator using **Color Off-screen Rendered**.

**shouldRasterize.** This property tells the layer to cache its rendered content in a bitmap and use it in the following frames. For static layers with a complex hierarchy this speeds up rendering. For dynamic views (content or size changes often, an animation is running), the cache is constantly invalidated and redrawn: this is more expensive than not rasterizing at all and uses memory. So it should be enabled only for static content, with `rasterizationScale = UIScreen.main.scale`.
