---
title: "What is the difference between UIView and UIWindow?"
category: uikit
order: 121
---

`UIWindow` is a subclass of `UIView` that serves as the root of the view hierarchy shown on screen. It draws nothing itself; it is a container for content and the entry point for events.

Differences:

- an ordinary `UIView` is nested in other views (`superview`), while a `UIWindow` has no parent: it is attached to a scene (`UIWindowScene`, since iOS 13) and a screen;
- a window has a `rootViewController`: its view becomes the window's content;
- a window has a level (`windowLevel`): windows with a higher level are shown above the others (alerts, the keyboard, the status bar);
- a window can be the key window (`makeKeyAndVisible()`, `isKeyWindow`) and receives keyboard events;
- a window receives events from the system and distributes them through the view hierarchy (`sendEvent`, `hitTest`), and also manages orientation and size changes.

An app usually has one main window, but there can be several (for example, on iPad, with an external display, or for an overlay window). `UIView` is the common building block of the interface for drawing, layout and touch handling, while `UIWindow` is the topmost container of the hierarchy.
