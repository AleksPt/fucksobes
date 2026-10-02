---
title: "What are loadView, viewDidAppear and viewWillLayoutSubviews?"
category: uikit
order: 28
---

- **`loadView`**: overridden to create the view in code instead of using a storyboard.
- **`viewDidAppear`**: called right after the view controller has appeared on screen.
- **`viewWillLayoutSubviews`**: called before the controller's view lays out its subviews. The size of the view itself is already known, but its subviews' frames have not been calculated yet: they become accurate in `viewDidLayoutSubviews`.
