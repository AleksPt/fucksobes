---
title: "How do you increase a UIView's tap area?"
category: uikit
order: 133
---

The tap area is determined by the `point(inside:with:)` method: it says whether a point falls inside the view. To extend it beyond `bounds`, override the method:

```swift
final class BigTapButton: UIButton {
    override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        let area = bounds.insetBy(dx: -12, dy: -12)   // a negative inset expands the area
        return area.contains(point)
    }
}
```

The extended area works only if the parent does not clip touches: the parent's `hitTest` must reach this view (for example, if the parent has `clipsToBounds` and the point lies outside its bounds, the touch will not arrive). There are other approaches too: make the view itself larger (a transparent backing view with the required padding), use a `UIButton` with a configuration and `contentInsets`, add a larger transparent button on top of the icon, or override `hitTest(_:with:)`.

Apple's recommendation for the minimum tap target size is 44×44 pt.
