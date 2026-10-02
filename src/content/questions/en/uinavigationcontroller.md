---
title: "What is UINavigationController? What is it used for and how is it implemented?"
category: uikit
order: 82
---

`UINavigationController` is a container controller that manages a stack of child view controllers: it shows the topmost one and provides forward and backward transitions. It is the most common way to do hierarchical navigation.

The essentials:

- `viewControllers` is the stack; the first one is the root (`rootViewController`);
- `pushViewController(_:animated:)` adds a screen on top, `popViewController(animated:)` removes the top one, `popToRootViewController` returns to the root;
- a `UINavigationBar` is displayed at the top, and its content is set on each controller through `navigationItem` (title, buttons), while the back button is added automatically;
- by default, a swipe gesture from the left edge works for going back;
- at the bottom there is optionally a `UIToolbar`.

Transitions are animated, and the animation can be replaced with a custom one through `UINavigationControllerDelegate`. The type implements the "stack" pattern and is very often combined with `UITabBarController`, where each tab has its own navigation stack.
