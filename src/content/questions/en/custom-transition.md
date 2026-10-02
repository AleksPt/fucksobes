---
title: "How can you implement a custom transition animation between two screens?"
category: uikit
order: 87
---

Two objects are needed:

1. **An animator** implementing `UIViewControllerAnimatedTransitioning`: the `transitionDuration(using:)` method returns the duration, and `animateTransition(using:)` performs the animation. From the context you take the `containerView` (you have to add the view to be displayed to it yourself) and the source and destination controllers (`viewController(forKey:)`). When finished, you must call `transitionContext.completeTransition(true)`, or `false` if the transition was cancelled.
2. **A transition delegate** that returns the animator:
   - for modal presentation: the controller's `transitioningDelegate` (`UIViewControllerTransitioningDelegate`) with `modalPresentationStyle = .custom` or `.fullScreen`; the methods `animationController(forPresented:...)` and `animationController(forDismissed:)`;
   - for `UINavigationController`: `UINavigationControllerDelegate` and the `animationControllerFor:from:to:` method.

For interactive (gesture-driven) transitions, you additionally return a `UIPercentDrivenInteractiveTransition` and control progress through `update`, `finish`, `cancel`. For a non-standard shape of a modal window, use `UIPresentationController`.
