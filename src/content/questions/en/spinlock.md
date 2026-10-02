---
title: "What are spinlocks?"
category: concurrency
order: 65
---

A spinlock is a lock in which a waiting thread repeatedly polls a condition until it becomes true, instead of going to sleep. It is justified on multiprocessor systems when the wait is short: polling can be cheaper than blocking a thread with a context switch and updating the thread's data structures.

According to Apple's documentation, the system does not provide ready-made spinlocks because of their polling. There is `os_unfair_lock`: a low-level lock in which waiters block efficiently; it stores information about the owning thread so that the system can try to resolve priority inversion, and it must be unlocked on the same thread on which it was acquired.
