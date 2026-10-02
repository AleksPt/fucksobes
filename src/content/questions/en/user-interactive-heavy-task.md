---
title: "We have a very heavy task and send it to a queue with userInteractive priority. Will running this task affect our main thread in any way? Will the UI freeze, for example?"
category: concurrency
order: 24
---

Yes, the UI can freeze: when a high-load task runs, the main thread may respond worse, especially if the system is short of resources.

**The way out**

- Break the task into smaller parts or use **asynchronous methods**.
- If the task is critical for the UI, run it on a queue with a lower priority or on a **background queue**, and then update the UI on the main thread.
