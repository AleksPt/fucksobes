---
title: "How does background server synchronization work in iOS?"
category: networking
order: 12
---

An app cannot run in the background indefinitely, so background sync is built on mechanisms managed by the system:

- **Background `URLSession`** (`URLSessionConfiguration.background(withIdentifier:)`): uploads and downloads are handled by a separate system process even when the app is suspended or terminated; when they finish, the system launches the app and calls the delegate.
- **BackgroundTasks** (`BGTaskScheduler`, iOS 13+): `BGAppRefreshTask` for short data refreshes and `BGProcessingTask` for long-running work (you can require network or power). You register the task at launch, list its identifier in `Info.plist`, and schedule it with `submit(_:)`; the system picks the run time based on the user's habits, battery level and network. This replaces the deprecated Background Fetch (`performFetch`).
- **Silent push** (`content-available: 1`): the server sends a silent notification and the app wakes up for a short time in `application(_:didReceiveRemoteNotification:fetchCompletionHandler:)` to fetch data. It requires the Remote notifications capability; delivery is not guaranteed and is throttled by the system.
- **`beginBackgroundTask`**: gives you roughly 30 seconds to finish work already in progress after the app moves to the background.

In every case the system limits both time and frequency, so keep the work short, call `setTaskCompleted` or the completion handler on time, and handle `expirationHandler` correctly.
