---
title: "What is pthread and why was it used?"
category: concurrency
order: 99
---

`pthread` (POSIX threads) is the standard low-level C API for working with threads, available on Unix-like systems, including iOS and macOS (`pthread_create`, `pthread_join`, `pthread_mutex_t`, `pthread_cond_t`, `pthread_rwlock_t`). It is the foundation on which higher-level abstractions are built: `Thread` (`NSThread`) is a wrapper over pthread, and GCD uses the system's thread pool (workqueue) on top of it.

pthread used to be used when you needed to manage threads directly: stack size, priority, scheduling policy, affinity, as well as for cross-platform C/C++ code. Locks and condition variables were built from pthread primitives.

Today it is almost never used in application Swift code: GCD, `OperationQueue`, Swift Concurrency, and `NSLock` are simpler and safer and manage threads themselves. Working with pthread directly is needed for integrating with C libraries and in specific cases (for example, a thread with a large stack). You also have to take care of releasing resources (`pthread_mutex_destroy`) and synchronization yourself.
