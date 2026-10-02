---
title: "What is CGLayer?"
category: uikit
order: 127
---

`CGLayer` is a Core Graphics (Quartz 2D) object for repeated drawing: the content is drawn once into a separate "layer" (`CGLayerCreateWithContext`) and then copied into a context many times with `CGContextDrawLayerAtPoint`. This saved work when the same drawing had to be drawn many times (for example, a pattern).

It is important not to confuse it with `CALayer` from Core Animation: `CGLayer` is a low-level API for drawing into a bitmap context, with no hierarchy, animations or compositing, whereas `CALayer` is an object of the layer tree that backs every `UIView`.

Today `CGLayer` is considered an outdated technique: in practice, `UIGraphicsImageRenderer` and `UIImage`/`CGImage` are used to cache a drawing, and Core Animation layers (`CAShapeLayer`, `CAReplicatorLayer`) are used for reusable elements.
