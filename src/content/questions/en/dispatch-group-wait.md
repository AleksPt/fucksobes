---
title: "Can you wait for a DispatchGroup synchronously?"
category: concurrency
order: 27
---

Yes: `DispatchGroup.wait()` synchronously waits for all the group's tasks to finish (there are variants with a timeout: `wait(timeout:)`, `wait(wallTimeout:)`). Such waiting blocks the calling thread.

A non-blocking alternative is `notify(queue:work:)` (the completion handler runs when all the group's tasks have finished). The GCD documentation advises against calling blocking methods in tasks on concurrent queues: the system creates additional threads, and threads can run out.
