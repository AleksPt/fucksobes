---
title: "How does additionalSafeAreaInsets differ from contentInsetAdjustmentBehavior?"
category: uikit
order: 108
---

Both properties relate to the safe area, but they deal with different things.

- `additionalSafeAreaInsets` is a property of `UIViewController`. It extends the safe area for the controller's view and its child controllers beyond the system insets. This is how a parent container tells its children about its own overlapping elements, for example a custom bottom bar: `child.additionalSafeAreaInsets = UIEdgeInsets(top: 0, left: 0, bottom: 60, right: 0)`.
- `contentInsetAdjustmentBehavior` is a property of `UIScrollView`. It determines how the safe area affects the `adjustedContentInset` of the scrollable content: `.automatic`, `.scrollableAxes`, `.never`, `.always`. In other words, it only concerns the content insets of the scroll view and does not change the safe area itself.

In short: the first changes the safe area (affecting every view that depends on it), while the second decides how the content of a single scroll view uses the safe area that already exists.
