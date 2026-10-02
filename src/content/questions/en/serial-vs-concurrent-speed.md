---
title: "Why can a serial queue be faster than a concurrent one (context switching)?"
category: concurrency
order: 100
---

It depends on the task: a concurrent queue is not always faster. A serial queue runs tasks one at a time, so:

- there is no **context switch** overhead between threads (saving and restoring registers, losing the processor cache);
- there is no **contention for shared data**: no locks are needed, no waiting on mutexes, and no races;
- there is no **thread explosion**: extra threads are not created when there are many tasks;
- the execution order is predictable.

A concurrent queue wins when tasks are independent, heavy enough, and there are free cores: then parallel execution reduces the total time. But if the tasks are short, work with shared state, or each one blocks, the overhead of scheduling, synchronization, and thread switching can outweigh the gain, and sequential execution turns out faster. That is why you parallelize only what can really be computed independently, and protect access to shared resources with a serial queue, which is cheaper than locks.
