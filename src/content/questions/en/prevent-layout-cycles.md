---
title: "How does UIKit prevent infinite layout loops?"
category: uikit
order: 103
---

UIKit does not run layout in circles; it uses "needs layout" flags. Calling `setNeedsLayout()` merely marks the view, and the layout itself is performed once per pass of the run loop, after which the mark is cleared. This protects against redundant layouts when there are many changes in a row.

Additional mechanisms:

- layout runs only for views marked as invalid, and a change in a subview's size does not force the parent to be laid out again unless necessary;
- for Auto Layout, the engine monitors the number of constraint update passes: if there are too many in one cycle (more than there are views in the window), an exception is thrown that points to a cyclical change of constraints;
- the system collects changes and applies them in a single transaction.

None of this removes the developer's responsibility: inside `layoutSubviews()` you must not call `setNeedsLayout()` or change state that invalidates the layout again; constraint changes should be grouped and done outside the layout cycle.
