---
title: "If we need to add the layout in code, in which method do we do it? And why?"
category: uikit
order: 33
---

It depends on what exactly we are doing.

- The controller's root view is created in `loadView()`: you assign it to the `view` property and do not call `super`. The rest of the view setup is done in `viewDidLoad()`, which is called after the view hierarchy has been loaded into memory, regardless of whether it was loaded from a nib or created in `loadView()`.
- Placing subviews by `frame` is done in the view's own `layoutSubviews()`: you replace the default implementation only if autoresizing and constraints are not enough. You do not call the method directly: to trigger a recalculation, use `setNeedsLayout()` or `layoutIfNeeded()`.
- The controller has `viewDidLayoutSubviews()`: it is called after the view has placed its subviews following a `bounds` change, and it suits adjustments made after layout.
