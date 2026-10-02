---
title: "Is it true that tasks added to a queue asynchronously will run in parallel?"
category: concurrency
order: 18
---

No, that is not true. Adding a task asynchronously (`async`) only means that the calling code does not wait for the task. Parallelism depends on the type of queue: a serial queue runs one task at a time even if all the tasks were added asynchronously, while a concurrent queue starts several tasks at once, with the number depending on conditions in the system.
