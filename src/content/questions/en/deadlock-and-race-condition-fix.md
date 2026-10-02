---
title: "How do you get rid of deadlocks and race conditions?"
category: concurrency
order: 54
---

**Preventing a race condition.** Use synchronization mechanisms:

- **Mutexes (`NSLock`)**: exclusive access to a resource.
- **Semaphores (`DispatchSemaphore`).**
- **Queues (`DispatchQueue`)**: serial queues for working with shared resources.
