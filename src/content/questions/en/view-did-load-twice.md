---
title: "Can viewDidLoad be called twice?"
category: uikit
order: 25
---

Usually not: `viewDidLoad()` is called after the controller has loaded the view hierarchy into memory, that is, once per load of `view`.

A repeated call is possible only if `view` becomes `nil` again: a controller's `view` is a property with a setter, and when it is accessed while `nil`, the controller calls `loadView()` again, after which loading ends with a new `viewDidLoad()`. You can check whether the view is loaded, without triggering loading, via `isViewLoaded`.
