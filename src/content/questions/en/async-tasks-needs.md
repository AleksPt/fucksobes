---
title: "Which tasks may require asynchronous execution?"
category: concurrency
order: 88
---

Anything that can block a thread and hurt interface responsiveness, above all on the main thread, should run asynchronously:

- network requests: response time depends on the network;
- I/O operations: reading and writing files, databases, Core Data;
- heavy computation: image and video processing, sorting and parsing large data, encryption;
- loading resources, for example images for a feed;
- delayed and periodic actions: timers, background sync;
- waiting for external events: a server response, location, a user decision.

The main goal is not to block the main thread, because it is responsible for rendering and touch handling. Heavy work is moved to background queues or into `async` functions, and the result is returned to the main thread to update the UI. Independent operations can run in parallel to reduce the total time.
