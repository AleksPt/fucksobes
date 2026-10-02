---
title: "Can a CALayer handle touches?"
category: uikit
order: 6
---

No: `CALayer` does not inherit from `UIResponder` and does not receive touch events itself. The `touchesBegan(_:with:)` handlers and the others belong to responders: `UIView`, `UIViewController`, and so on. Touches are received by the view, for which the layer usually serves as the content store.

A layer has only `hitTest(_:)`: it returns the deepest descendant in the layer hierarchy (including the layer itself) that contains the point. The point is passed in the superlayer's coordinate system. This lets you manually determine which layer a touch landed in, for example from a view's `touchesBegan`.
