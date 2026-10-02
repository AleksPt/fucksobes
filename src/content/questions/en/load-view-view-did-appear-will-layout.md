---
title: "What are loadView, viewDidAppear and viewWillLayoutSubviews?"
category: uikit
order: 28
---

- **`loadView`**: overridden to create the view in code instead of using a storyboard.
- **`viewDidAppear`**: called right after the view controller has appeared on screen.
- **`viewWillLayoutSubviews`**: called before the controller's view lays out its subviews. The bounds have been finally calculated.
