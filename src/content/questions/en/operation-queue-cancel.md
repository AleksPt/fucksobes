---
title: "How do you cancel a task in OperationQueue?"
category: concurrency
order: 44
---

Call the `cancel()` method. However, cancellation requires manually checking the `isCancelled` flag in the operation's code.
