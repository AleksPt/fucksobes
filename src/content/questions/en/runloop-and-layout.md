---
title: "How is the run loop related to UI layout?"
category: uikit
order: 131
---

UI layout and drawing are not performed instantly: they are tied to the main run loop. Calls to `setNeedsLayout()` and `setNeedsDisplay()`, as well as changes to layer properties, merely mark the view or layer as changed.

Core Animation registers an observer in the main run loop. When the run loop finishes processing events and is about to "sleep" (`beforeWaiting`) or finishes an iteration, the observer starts the update cycle: `updateConstraints`, `layoutSubviews` and `draw(_:)` (for marked views) run, and the transaction is sent for rendering (commit). Therefore:

- many changes in one run loop iteration lead to a single layout rather than several;
- `layoutIfNeeded()` performs layout early, without waiting for that moment;
- if the main thread is busy with long work, the run loop does not reach the UI update, and the interface "freezes".

The run loop mode matters too: during scrolling it switches to `tracking`, and processing of other sources (timers in `default`) is suspended.
