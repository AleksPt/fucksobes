---
title: "What are center and origin of a UIView?"
category: uikit
order: 128
---

Both properties describe the view's position in its parent's (superview's) coordinate system, but in different ways.

- `frame.origin` is the coordinates of the top-left corner of the `frame` rectangle (in superview coordinates).
- `center` is the coordinates of the view's center (also in the superview's system). It is the layer's `position` when the default `anchorPoint = (0.5, 0.5)` is used.

Relationship: with no transforms, `center = (origin.x + width/2, origin.y + height/2)`. When `bounds.size` changes, `center` stays in place and `origin` shifts; when `frame` changes, both change.

The difference shows up with transforms: `frame` is computed as the bounding rectangle of the transformed view, so on rotation both its `origin` and `size` change, while `center` and `bounds` stay the same. That is why, if a view is rotated or scaled, you move it through `center` rather than `frame`.
