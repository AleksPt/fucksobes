---
title: "What is anchorPoint?"
category: uikit
order: 135
---

`anchorPoint` is a `CALayer` property (available on a view as `layer.anchorPoint`): a point inside the layer, in normalized coordinates from 0 to 1 (by default `(0.5, 0.5)`, the center). It is the point that transforms (rotation, scale) are applied around, and the point where the layer's `position` is placed.

If you set `anchorPoint = (0, 0)`, rotation happens around the top-left corner instead of the center:

```swift
view.layer.anchorPoint = CGPoint(x: 0, y: 0)
view.transform = CGAffineTransform(rotationAngle: .pi / 4)
```

An important detail: changing `anchorPoint` shifts the layer, because `position` stays the same while the frame is computed from the new point. To keep the layer visually in place, you need to adjust `position` (or `frame`). A view's `center` is the layer's `position`. It is used for animations that rotate around an edge or a corner, for hanging (pendulum) effects, and for rotating hands.
