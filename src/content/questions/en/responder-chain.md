---
title: "What is the responder chain and what is it for?"
category: uikit
order: 47
---

The responder chain is the mechanism iOS uses to handle events: screen touches, motion, button presses and so on. It is a hierarchy (a chain) of objects that can "respond" to an event. These objects are instances of classes that inherit from `UIResponder` (for example, `UIApplication`, `UIViewController`, `UIView`). `UIResponder` defines the order in which objects handle events (touches, events from UI elements such as buttons, text changes).

**How an event enters the chain.** A `UIEvent` is created and sent by `UIApplication.shared.sendEvent()` to the `UIWindow`. For touches, the window uses `hitTest(_:with:)` to find the view the touch belongs to; events of other types (keyboard, motion) are sent to the first responder. An unhandled event is passed further along the chain (`next`).

`UIResponder` also declares methods that let objects determine who will handle messages first:

- `becomeFirstResponder`: the receiver becomes the first responder and gets the events addressed to the first responder first (keyboard, motion, actions with `target = nil`);
- `resignFirstResponder`: the receiver declines to handle messages first.
