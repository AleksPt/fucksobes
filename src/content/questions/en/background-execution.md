---
title: "Can an app run in the background indefinitely?"
category: uikit
order: 74
---

No. When the app goes to the background, the system calls `applicationDidEnterBackground(_:)`, which has five seconds to finish its tasks. Shortly after the method returns, the app is moved to the `Suspended` state.

If more time is needed, call `beginBackgroundTask(withName:expirationHandler:)`; the remaining time is available via `backgroundTimeRemaining`. When the work is done, you must call `endBackgroundTask(_:)` right away: if you fail to do so in time, the system terminates the app. For longer tasks, use the `BackgroundTasks` framework, where the work is performed through tasks scheduled by the system.
