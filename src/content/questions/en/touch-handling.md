---
title: "The user tapped a view; how will it handle the tap?"
category: uikit
order: 55
---

UIKit first determines which view will receive the touch: `hitTest(_:with:)` walks the hierarchy and looks for the deepest subview that contains the touch point (skipping hidden views, views with `isUserInteractionEnabled` turned off and those with `alpha` below `0.01`). This view becomes the first responder for the touch.

Then:

- gesture recognizers receive touches before the view itself; if they do not recognize the gesture, the touches arrive at the view;
- a `UIControl` (for example, a button) tracks touches itself and sends an action to its target;
- if the view did not handle the touch, it is passed up the responder chain: the superview, then the view controller (for the root view), the window, `UIApplication`.
