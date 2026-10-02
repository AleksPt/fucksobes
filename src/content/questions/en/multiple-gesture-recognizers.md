---
title: "What if there is more than one gesture recognizer there? How do I make them not conflict?"
category: uikit
order: 64
---

By default, UIKit recognizes only one gesture at a time on a single view. The order of recognition is controlled through the `UIGestureRecognizerDelegate` delegate; for any pair of conflicting recognizers, only one of them needs the delegate.

- `gestureRecognizer(_:shouldRequireFailureOf:)` and `gestureRecognizer(_:shouldBeRequiredToFailBy:)` specify that one gesture must "fail" before another. For example, a `pan` will not fire until a `swipe` has failed, and a single tap waits for the double tap to fail.
- `gestureRecognizer(_:shouldRecognizeSimultaneouslyWith:)` allows gestures to be recognized at the same time if it returns `true`.
