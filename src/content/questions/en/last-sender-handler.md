---
title: "We have set a sender; who is the last one that can handle the button?"
category: uikit
order: 61
---

The last object that can handle the tap is **`UIApplication`** or its delegate (**`AppDelegate`**), but only when the button's `target` is `nil`.

A button tap is not a touch travelling along the responder chain but an action: `UIControl` sends it through `UIApplication.sendAction(_:to:from:for:)`. If the button has a `target`, the method is called directly on it and no chain is involved.

**The responder chain when `target = nil`**

The search starts at the first responder (or at the button itself if there is none) and goes up the chain to the first object that implements the method:

1. **A view**: the view itself and its superview, then further up the view hierarchy.
2. **`UIViewController`**: if the view is the controller's root view.
3. **`UIWindow`**: the window that the hierarchy belongs to.
4. **`UIApplication`**.
5. **`AppDelegate`**: only if it inherits from `UIResponder`.

If the method is not found anywhere, the tap does nothing.
