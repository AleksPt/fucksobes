---
title: "How can priority inversion occur?"
category: concurrency
order: 55
---

1. **A resource is locked by a low-priority thread.** A low-priority thread acquires a resource (for example, a mutex) and does not release it.
2. **A high-priority thread waits for that resource.** It tries to acquire the same resource and has to wait until the low-priority thread releases it.
3. **Medium-priority threads get in the way of the low-priority one.** They do not depend on the acquired resource and keep running, since their priority is higher than that of the low-priority thread. As a result, the low-priority thread cannot release the resource, and the high-priority one stays blocked.

The system tries to resolve the inversion automatically: for the duration of the inversion it temporarily raises the QoS of the low-priority work that the high-priority work depends on (for example, with `dispatch_sync` or `pthread_mutex_lock`). The QoS of the queue itself does not change, so you should not put high-priority tasks into a low-QoS queue.
