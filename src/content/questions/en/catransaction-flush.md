---
title: "What happens if you call CATransaction.flush()?"
category: uikit
order: 119
---

Core Animation collects layer changes into transactions. While the developer changes layer properties, the changes accumulate in an implicit transaction, which is committed automatically at the end of the current pass of the run loop, after which the changes are handed over to the render process.

`CATransaction.flush()` forcibly commits the current implicit transaction right away, without waiting for the end of the run loop pass. The changes are sent for rendering immediately.

It does not lay out views: for that you need `layoutIfNeeded()` and `setNeedsLayout()`. The method is rarely needed: for example, to guarantee that a layer's initial state has already been applied before starting the next animation, or in a loop where intermediate states need to be shown. Frequent use is harmful: it breaks batching of changes, increases the load and can cause animation artifacts. Apple advises avoiding an explicit call: without it, atomic screen updates are preserved and performance is better; it is mainly needed where the thread has no run loop. The documentation does not require calling it only from the main thread: an implicit transaction is created separately for each thread.
