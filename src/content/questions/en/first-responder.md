---
title: "How is the first responder determined?"
category: uikit
order: 50
---

UIKit assigns the first responder depending on the type of event. For touches, hit-testing is used: the `hitTest(_:with:)` method of `UIView` walks the view hierarchy and looks for the deepest subview that contains the touch point, which becomes the first responder for that event. Some events, such as motion events, are sent first to the current first responder (`isFirstResponder`).

An object can also become the first responder explicitly through `becomeFirstResponder()`, if its `canBecomeFirstResponder` returns `true`. An unhandled event is passed further along the responder chain: from the view to its superview, the view controller, the window and `UIApplication`.
