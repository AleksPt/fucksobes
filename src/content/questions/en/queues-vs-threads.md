---
title: "What is the difference between a queue and a thread in GCD?"
category: concurrency
order: 7
---

> A queue manages tasks, and a thread executes them.

- **Queue**: a data structure to which tasks are added for execution. It can be **serial** (tasks run one after another) or **concurrent** (tasks can run in parallel).
- **Thread**: a system resource for executing tasks. Queues decide on their own which threads to run tasks on, optimizing their distribution.
