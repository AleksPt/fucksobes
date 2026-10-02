---
title: "Why is it dangerous to create new constraints in viewDidLayoutSubviews?"
category: uikit
order: 99
---

`viewDidLayoutSubviews()` and `layoutSubviews()` are called on every layout pass: on rotation, on size changes, when the keyboard appears, when content changes. If you create and activate constraints in them, a new set is added on every call.

Consequences:

- **duplicates and conflicts**: copies of constraints pile up, "Unable to simultaneously satisfy constraints" warnings appear, and the layout becomes unpredictable;
- **performance drop**: the engine solves more and more equations, and each added constraint marks the layout as outdated and may trigger another pass;
- **risk of loops**: changing constraints inside layout triggers the next layout, so you can end up with an endless chain of updates;
- **memory leaks** if constraints hold references to views.

The right approach is to create constraints once (in `viewDidLoad` or the initializer), and inside the layout method only change the `constant` of the existing ones, if necessary.
