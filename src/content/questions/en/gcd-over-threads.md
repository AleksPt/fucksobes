---
title: "What does GCD give you on top of plain threads?"
category: concurrency
order: 9
---

Concurrency used to require creating threads manually. That is hard: the optimal number of threads changes with load and hardware, and synchronization complicates the code. GCD frees you from this: you describe tasks, and the system manages the threads (a thread pool), which gives scalability and a simpler model.

Other advantages of queues from the documentation: they are more memory-efficient (thread stacks are not kept in memory), they do not trap into the kernel under load, and asynchronously submitting a task to a queue cannot lead to a deadlock. Serial queues are an efficient alternative to locks.
