---
title: "What is the responder chain and what is it for?"
category: uikit
order: 47
---

The responder chain is the mechanism iOS uses to handle events: screen touches, motion, button presses and so on. It is a hierarchy (a chain) of objects that can "respond" to an event. These objects are instances of classes that inherit from `UIResponder` (for example, `UIApplication`, `UIViewController`, `UIView`). `UIResponder` defines the order in which objects handle events (touches, events from UI elements such as buttons, text changes).

**How an event enters the chain.** A `UIEvent` is created and sent by `UIApplication.shared.sendEvent()` to the `UIWindow`. The window uses `hitTest(_:with:)` to determine which `UIResponder` the event belongs to, and designates it as the `first responder`.

`UIResponder` also declares methods that let objects determine who will handle messages first:

- `becomeFirstResponder`: the receiver gets all the events sent by the system first;
- `resignFirstResponder`: the receiver declines to handle messages first.
