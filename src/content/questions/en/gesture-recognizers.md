---
title: "How does UIGestureRecognizer work?"
category: uikit
order: 62
---

When the user touches the screen, a unique `UITouch` object associated with that touch is created. A touch is a chain of events: the finger touches the screen, moves across it and lifts off.

Then `hitTest` is used to find the deepest `UIView` in the hierarchy whose coordinates contain the touch. The `UIView` that is found becomes the `firstResponder` and starts receiving `UITouch` notifications:

- `touchesBegan`: the touch begins;
- `touchesMoved`: the touch parameters change;
- `touchesEnded`: the touch ends;
- `touchesCancelled`: the touch is cancelled.
