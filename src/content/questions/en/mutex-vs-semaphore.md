---
title: "What is the difference between a mutex and a semaphore?"
category: concurrency
order: 62
---

A mutex is similar to a semaphore with a value of **1**: it lets only one thread at a time access the critical section, and the other threads wait for it to be released. But this is a simplification: a mutex has an **owner**, and it must be released by the same thread that acquired it (`pthread_mutex_unlock` from another thread fails with `EPERM`, and `os_unfair_lock` aborts the process). A semaphore has no owner: `signal` can be called from any thread, so a semaphore also works for signaling between threads. A semaphore with a value greater than 1 lets several threads access the resource at the same time, as many as the value specifies.

A **semaphore** controls access through a **permit counter**.

- `wait`: the counter is decremented by 1. If it was greater than 0, the thread gets access to the resource. If it is 0, the thread blocks until another thread calls `signal`.
- `signal`: the counter is incremented by 1, and one of the waiting threads (if any) is unblocked.

A **mutex** provides a **binary lock** (mutual exclusion): only one thread can hold it.

- `lock`: if the mutex is free, the thread acquires it; if it is taken, the thread blocks until it is released.
- `unlock`: the mutex is released, and another thread can acquire it.
