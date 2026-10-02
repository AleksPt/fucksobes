---
title: "When will the origin of frame and bounds be non-zero?"
category: uikit
order: 13
---

`frame` describes a view's position and size in the superview's coordinate system, while `bounds` describes them in the view's own coordinate system. So `frame.origin` is non-zero when the view is offset from the origin of the superview.

By default `bounds.origin` is `(0, 0)` and its size matches the size of `frame`. It becomes non-zero only if you change it explicitly.

If a non-identity `transform` is applied to the view, the value of `frame` is undefined and must not be changed: set the position through `center` and the size through `bounds`.
