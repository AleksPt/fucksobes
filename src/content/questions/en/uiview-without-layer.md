---
title: "Can a UIView have no layer?"
category: uikit
order: 137
---

No. Every `UIView` always relies on a `CALayer`: the `layer` property is non-optional, is created together with the view, and the view is merely its "manager". The layer performs drawing, animation and compositing, while the view adds event handling, hierarchy, layout and access to the UIKit API.

The layer type can be replaced by overriding `layerClass`:

```swift
final class GradientView: UIView {
    override class var layerClass: AnyClass { CAGradientLayer.self }
    var gradient: CAGradientLayer { layer as! CAGradientLayer }
}
```

The reverse is not true: a layer can exist without a view (for example, a `CAShapeLayer` added via `layer.addSublayer`), and layers are cheaper than views because they do not handle events and do not take part in the responder chain. SwiftUI views are not `UIView`s, but when displayed on UIKit platforms they too ultimately produce layers.
