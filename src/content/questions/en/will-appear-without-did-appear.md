---
title: "When will viewWillAppear be called but viewDidAppear not?"
category: uikit
order: 92
---

`viewWillAppear` signals that the transition to the screen has started, and `viewDidAppear` that it has finished. If the transition did not reach the end, the second method is not called. Typical cases:

- **a cancelled interactive transition**: the user started swiping a screen away with the "back" gesture of a `UINavigationController` but changed their mind and returned it; the previous screen received `viewWillAppear`, then right away `viewWillDisappear` and `viewDidDisappear`, but no `viewDidAppear`;
- **an interrupted presentation**: while the animation is running, the screen is closed and another one is shown instead (for example, `present` in `viewWillAppear`);
- **the app being minimized** or a system interruption at the moment of the transition;
- **mistakes in custom containers**: incorrectly called `beginAppearanceTransition` and `endAppearanceTransition` on child controllers.

Therefore the `willAppear/didAppear` pair cannot be considered a guaranteed sequence: subscriptions started in `viewWillAppear` should be cancelled in `viewWillDisappear` as well, not only in `viewDidDisappear`.
