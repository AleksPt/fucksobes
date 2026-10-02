---
title: "How can you manually make an operation cancellable in GCD?"
category: concurrency
order: 35
---

- **`DispatchWorkItem`** with its `cancel()` method.
- **A custom flag** (`isCancelled`).
- **A cancellation token** (`CancellationToken`) for more complex scenarios.
