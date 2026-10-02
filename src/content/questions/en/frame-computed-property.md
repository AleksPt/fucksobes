---
title: "Is frame a computed property? What affects how it is calculated?"
category: uikit
order: 149
---

Yes. In `UIView`, `frame` is not stored as a separate value: it is a computed property built from the layer's (`CALayer`) properties:

- **`position`** (in `UIView` this is `center`): the position of the anchor point in superview coordinates;
- **`bounds.size`**: the size of the view;
- **`anchorPoint`**: the point inside the layer to which `position` is attached (the center by default);
- **`transform`**: an affine transformation (rotation, scale).

If the transform is the identity, `frame.origin` is derived from `position` and `anchorPoint`, and `frame.size` equals `bounds.size`. When you set `frame`, `position` and `bounds.size` are recalculated.

If the view has a transform (for example, a rotation), `frame` is the **smallest rectangle that encloses the transformed view** in superview coordinates. That is why after a 45° rotation `frame` becomes larger than `bounds`, while `bounds` stays the same. You must not set `frame` when the transform is not the identity: the result is undefined, and you should change size and position through `bounds` and `center`.

```swift
let view = UIView(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
view.transform = CGAffineTransform(rotationAngle: .pi / 4)

print(view.bounds) // (0, 0, 100, 100) — unchanged
print(view.frame)  // approximately (-20.7, -20.7, 141.4, 141.4) — the enclosing rectangle
```
