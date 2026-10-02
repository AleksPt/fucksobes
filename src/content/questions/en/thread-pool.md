---
title: "What is a thread pool?"
category: concurrency
order: 90
---

A thread pool is a pre-created set of worker threads that are reused to execute many tasks. Tasks go into a queue, a free thread takes the next one and runs it, and after finishing it returns to the pool and waits for the next.

Why: creating and destroying a thread is expensive (memory for the stack, system calls), and too many threads lead to context switches and thread explosion. A fixed or bounded number of threads lets you keep the load under control and start executing tasks faster.

In iOS the pool is managed by the system, not the developer: GCD (`DispatchQueue`) decides on its own how many threads to create based on the number of cores and the load; `OperationQueue` (on top of GCD) works the same way, as does the cooperative thread pool in Swift Concurrency, where the number of threads is limited by the number of cores and `await` frees the thread for other tasks. That is why blocking calls in `async` functions (semaphores, `sleep`) are harmful: they occupy a pool thread.
