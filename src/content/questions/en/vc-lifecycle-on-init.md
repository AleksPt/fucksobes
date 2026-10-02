---
title: "Will a VC's lifecycle start if it is simply initialized?"
category: uikit
order: 23
---

No, the view lifecycle will not start. A view controller loads its views lazily: the hierarchy is created on the first access to the `view` property, and `viewDidLoad()` is called after the view has been loaded into memory. Plain initialization does not load the view (you can check through `isViewLoaded`, accessing which does not trigger loading).

The visibility callbacks (`viewIsAppearing(_:)`, `viewWillDisappear(_:)`, etc.) are called when the controller's view visibility changes, that is, when it is shown on screen, not when it is created.
