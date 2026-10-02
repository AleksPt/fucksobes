---
title: "List the states of an Operation"
category: concurrency
order: 41
---

`Operation` has no single state enum; its state is described by KVO-compliant properties:

- `isReady`: the operation is ready to execute (all its dependencies have finished);
- `isExecuting`: the operation is executing;
- `isFinished`: the operation is finished (including a cancelled one: after `cancel()` it still moves to finished);
- `isCancelled`: the cancellation flag; cancelling does not interrupt the work, and the code must check the flag itself.
