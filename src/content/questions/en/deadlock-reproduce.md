---
title: "How can you reproduce a deadlock?"
category: concurrency
order: 52
---

- **Synchronously adding a task to the same serial queue.** If a task running on a serial queue synchronously (`sync`) adds another task to the same queue, a deadlock occurs: the current task cannot finish until the added one finishes, and the added one is waiting for that same queue to become free.
- **`sync` on the main queue (`DispatchQueue.main`) from the main thread.** The main thread blocks waiting for a task that cannot start because the main thread is busy.
- **Mutual blocking across different queues.** If two queues synchronously add tasks to each other that wait for each other to finish.
- **Acquiring resources (mutexes, semaphores) in a different order in different threads.**
- **Waiting for an event or signal that will never happen.**
- **Incorrect use of `DispatchGroup`**, when `wait` is called inside one of the group's tasks.
- **A circular dependency in `Operation`.**
