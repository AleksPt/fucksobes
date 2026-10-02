---
title: "How do you protect a critical section to prevent a race condition / data race (example: we have an int property accessed from different threads)?"
category: concurrency
order: 50
---

1. Rewrite `get` and `set`: read synchronously and write asynchronously with a barrier.
2. At the point of use, restrict access to a single thread with a semaphore.
3. Use `NSLock`.
