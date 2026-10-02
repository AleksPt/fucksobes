---
title: "What are Dispatch Sync and Dispatch Async?"
category: concurrency
order: 16
---

- **`sync`** blocks the current thread, runs the task, and returns control only after it finishes.
- **`async`** does not block: it adds the task to the end of the queue and returns control immediately, without waiting for completion.
