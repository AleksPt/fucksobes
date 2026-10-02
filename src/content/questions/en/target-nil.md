---
title: "We take a button and set a selector and a target on it. The target can be self, some view, or nil. What happens if we set nil?"
category: uikit
order: 60
---

If `target` is `nil`, UIKit looks for the handler (`someAction`) **along the responder chain**. If a method with the given selector is found in the chain, it is called. If it is not in the controller, UIKit keeps searching in the button's superview, then in its superview, and so on along the chain.

If the method is not found anywhere in the chain, the button tap is **simply ignored** and no error occurs.

If, however, **`self`** is specified as the `target` and the method is not found, the app **crashes** with an `unrecognized selector sent to instance` error, because `self` does not have the specified handler.
