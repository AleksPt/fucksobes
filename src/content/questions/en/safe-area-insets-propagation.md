---
title: "How do safeAreaInsets work in nested controllers and containers?"
category: uikit
order: 107
---

A view's `safeAreaInsets` describe which part of its bounds is covered by system elements (the notch, the Home indicator, navigation bars, tab bars, a toolbar), rather than the sum for the whole window. Values are passed top-down through the hierarchy: a view receives only the insets that fall within its bounds. If a nested view does not intersect the notch or a bar, its `safeAreaInsets` are zero.

In containers (`UINavigationController`, `UITabBarController` and custom ones), the system accounts for the container's bars: a child controller gets insets that reflect the bars lying on top of its view. A custom container with a non-standard bar can tell its children about it through the child controller's `additionalSafeAreaInsets`.

Changes are reported by `safeAreaInsetsDidChange()` on the view and `viewSafeAreaInsetsDidChange()` on the controller. For layout you use `safeAreaLayoutGuide`, and for scroll views also `contentInsetAdjustmentBehavior`.
