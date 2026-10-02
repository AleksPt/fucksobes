---
title: "What is UIView?"
category: uikit
order: 2
---

`UIView` is an object that manages the content of a rectangular area of the screen: it draws content within its `bounds` and handles interaction with it. It is the main building block of the interface.

The key points:

- views form a hierarchy: a view can have many subviews but only one superview; the stacking order is set by the order of addition (`addSubview(_:)`, `insertSubview(_:aboveSubview:)`);
- geometry is defined by `frame` (in superview coordinates) and `bounds` (internal dimensions);
- drawing happens on demand: the system calls `draw(_:)`, and you report content changes via `setNeedsDisplay()`;
- some properties are animatable;
- you must work with views on the main thread.

`UIView` is a concrete class (you can use it to show a colored background); subclassing it is recommended only when the standard capabilities are not enough.
