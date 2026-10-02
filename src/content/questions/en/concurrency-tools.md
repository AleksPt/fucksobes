---
title: "What ways of working with multithreading do you know?"
category: concurrency
order: 2
---

- **Threads** (`Thread`, POSIX threads): a low-level tool that you have to manage manually.
- **GCD** (`DispatchQueue`, `DispatchGroup`, `DispatchSemaphore`): tasks are submitted to queues, and the system manages the threads.
- **Operations** (`Operation`, `OperationQueue`): tasks as objects with dependencies and KVO notifications.
- **Swift Concurrency**: `async`/`await`, `Task`, actors (`actor`, `@MainActor`), and data isolation to protect against races.
