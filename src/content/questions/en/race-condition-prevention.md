---
title: "How do you get rid of a race condition?"
category: concurrency
order: 48
---

1. Use thread synchronization (for example, **locks**).
2. Use queues (for example, **serial dispatch queues**) to order access.
3. Use atomic operations.
4. Avoid shared access to mutable data.
5. Use thread-safe data structures.
