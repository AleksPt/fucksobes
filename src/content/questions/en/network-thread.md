---
title: "On which thread should you load data from the network?"
category: concurrency
order: 96
---

A network request must not be executed and awaited on the main thread: it blocks the interface. But there is no need to create a thread manually either: `URLSession` works asynchronously and performs network operations off the main thread by itself. The developer only chooses where to process the result.

- The **completion handler** of `URLSession.dataTask` is called on the session's delegate queue (`delegateQueue`), by default a background serial queue of `URLSession`, not the main one.
- **`async/await`** (`try await URLSession.shared.data(from:)`): the call does not block a thread, and heavy processing (parsing large responses) is moved to a background task.
- **UI updates** only on the main thread: `DispatchQueue.main.async { ... }` or `await MainActor.run { ... }` (or `@MainActor` on the view model).

Heavy response parsing (JSON, images) is done in the background, and only the finished result is returned to the main thread. The priority of background work is set through QoS (`.userInitiated` for a download the user is waiting for).
