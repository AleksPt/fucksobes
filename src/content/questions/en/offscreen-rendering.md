---
title: "How does offscreen rendering work and how can you catch it in your layout?"
category: uikit
order: 109
---

Normally layers are drawn straight into the frame buffer. Offscreen rendering is when the GPU first renders a layer (or a group of layers) into a separate intermediate buffer and then composites it onto the screen. This requires extra memory and context switches, so during scrolling and animations it causes an FPS drop.

Common causes:

- masks (`layer.mask`), as well as rounding (`cornerRadius` together with `masksToBounds`) for a layer with content or sublayers: not always, it depends on the iOS version and the content;
- shadows without `shadowPath`: the system has to compute the shadow's shape from the layer's content;
- `shouldRasterize` and group opacity (`allowsGroupOpacity`) for complex hierarchies;
- blurring and some effects (`UIVisualEffectView`).

How to find it: in the simulator, **Debug → Color Off-screen Rendered** (layers are highlighted in yellow) and Instruments (Core Animation). How to fix it: set a `shadowPath`, use pre-rendered rounded images, `cornerCurve` and `CAShapeLayer`, simplify the hierarchy, and rasterize only static layers.
