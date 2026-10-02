---
title: "Which QoS should you use for network requests?"
category: concurrency
order: 101
---

The choice depends on how urgently the user needs the result right now:

- **`.userInitiated`**: the request was triggered by a user action (a button tap, opening a screen), and the user is waiting for the result to continue: loading a feed or product details. The expected time is seconds.
- **`.utility`**: long tasks with a progress indicator, where the result is not needed instantly: downloading a file, syncing with user-visible progress.
- **`.background`**: work unrelated to the current action: prefetching data, background sync, sending analytics. It runs at minimum priority and saves battery.
- **`.default`**: if nothing is specified.
- **`.userInteractive`** is not suitable for networking: it is for short work tied to animations and interface responsiveness.

For `URLSession`, the network quality of service is also set through the `URLSessionConfiguration.networkServiceType` property and `URLSessionTask.priority`, and `isDiscretionary` on a background session lets the system pick a convenient time (Wi-Fi and power). `Task(priority:)` tasks use the same levels.
