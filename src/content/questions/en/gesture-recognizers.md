---
title: "How does UIGestureRecognizer work?"
category: uikit
order: 62
---

`UIGestureRecognizer` separates recognizing a gesture (tap, pan, pinch, swipe, long press and so on) from the code that reacts to it. It is attached to a view with `addGestureRecognizer(_:)`, and when it recognizes the gesture it sends an action to its target. A gesture recognizer does not participate in the responder chain.

How it works:

- when the user touches the screen, a `UITouch` is created and `hitTest` finds the deepest view under the finger; the touches go to the recognizers attached to that view and its superviews, before they reach the view itself;
- a recognizer works as a state machine: a discrete gesture goes from `possible` to `recognized` or `failed`, a continuous one goes `possible → began → changed → ended` (or `cancelled`/`failed`);
- until the gesture is recognized, the view receives touches as usual (`touchesBegan`, `touchesMoved`, `touchesEnded`); once it is recognized, the remaining touches for the view are cancelled and it receives `touchesCancelled` (with `cancelsTouchesInView = true`, the default);
- conflicts between several recognizers are resolved through `UIGestureRecognizerDelegate` and `require(toFail:)`.
