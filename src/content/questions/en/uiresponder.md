---
title: "UIResponder"
category: uikit
order: 49
---

`UIResponder` is an abstract interface for receiving and handling events, the foundation of event handling in UIKit. The responders are `UIApplication`, `UIViewController` and all `UIView`s (including `UIWindow`).

To handle events, a responder overrides the corresponding methods: for touches these are `touchesBegan(_:with:)`, `touchesMoved(_:with:)`, `touchesEnded(_:with:)` and `touchesCancelled(_:with:)`. The kinds of events are touches, motion, remote-control and press events. A responder passes an unhandled event to the next one in the responder chain (a view to its superview, a root view to its view controller). Responders can also accept input through an input view, for example the keyboard of a `UITextField`.
