---
title: "We take a button and set a selector and a target on it. The target can be self, some view, or nil. What happens if we set nil?"
category: uikit
order: 60
---

If `target` is `nil`, UIKit looks for the handler (`someAction`) **along the responder chain**. The search starts at the first responder (or at the button itself if there is none) and goes up: the view, its superview and further up the hierarchy, then the view controller, the window, `UIApplication` and, if it inherits from `UIResponder`, the app delegate. The method is called on the first object found that implements it.

If the method is not found anywhere in the chain, the button tap is **simply ignored** and no error occurs.

If, however, **`self`** is specified as the `target` and the method is not found, the app **crashes** with an `unrecognized selector sent to instance` error, because `self` does not have the specified handler.
