---
title: "When should you use updateViewConstraints()?"
category: uikit
order: 94
---

`updateViewConstraints()` is a `UIViewController` method that the system calls before layout when the controller's constraints need updating (after `setNeedsUpdateConstraints()` on its view). The view-level counterpart is `updateConstraints()`.

You override it to gather all constraint changes in one place and apply them in a batch: enable or disable a set of constraints depending on state (for example, portrait vs. landscape), or create them lazily, once. You must call `super.updateViewConstraints()` at the end.

```swift
override func updateViewConstraints() {
    if !didSetupConstraints {
        NSLayoutConstraint.activate([...])
        didSetupConstraints = true
    }
    compactConstraint.isActive = isCompact
    super.updateViewConstraints()
}
```

A re-run is requested by calling `setNeedsUpdateConstraints()`, not the method itself. It is rarely used today: constraints are more often created in `viewDidLoad()` and changed directly through `isActive` and `constant`. The method is useful when there are many updates and they need to be merged into a single batch.
