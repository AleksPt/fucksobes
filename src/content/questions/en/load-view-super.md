---
title: "Do you need to call super in loadView? Why?"
category: uikit
order: 30
---

No. Apple's documentation requires that a custom implementation of `loadView` not call `super`: you create the root view yourself and assign it to the `view` property, while the default implementation does the same thing (loads the view from a nib or creates a plain `UIView`), so the call would only create an extra object. There is no recursion. If the view is defined in Interface Builder, `loadView` is not overridden at all.
