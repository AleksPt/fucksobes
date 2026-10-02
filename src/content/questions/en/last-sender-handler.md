---
title: "We have set a sender; who is the last one that can handle the button?"
category: uikit
order: 61
---

The last object that can handle the event is **`UIApplication`** or its delegate (**`AppDelegate`**).

**The responder chain for a button event**

1. **`UIButton`**: the button itself handles the event first, if it has an action method (`action`) implemented.
2. **The button's superview (`UIView`)**: if the button did not handle the event, it is passed to its superview.
3. **`UIViewController`**: if the superview did not handle the event, it is passed to the controller, if the button is part of its hierarchy.
4. **`UIWindow`**: if the controller did not handle the event, it is passed to the window that the button belongs to.
5. **`UIApplication`**: if the window did not handle the event, it is passed to `UIApplication`.
6. **`AppDelegate`**: if `UIApplication` did not handle the event, it may be handled by the app delegate.
