---
title: "How is the first responder determined?"
category: uikit
order: 50
---

UIKit chooses the recipient of an event depending on its type. For touches, hit-testing is used: the `hitTest(_:with:)` method of `UIView` walks the view hierarchy and looks for the deepest subview that contains the touch point, and that view receives the touch. This is not the same as the first responder (`isFirstResponder`): a touch does not designate a first responder. The first responder is a separate concept: it is the object that, for example, keyboard events, motion events and actions with `target = nil` are sent to first.

An object becomes the first responder explicitly through `becomeFirstResponder()`, if its `canBecomeFirstResponder` returns `true`. An unhandled event is passed further along the responder chain: from the view to its superview, the view controller, the window and `UIApplication`.
