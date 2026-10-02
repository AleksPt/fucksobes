---
title: "What is APNs and how does it work?"
category: networking
order: 18
---

**APNs** (Apple Push Notification service) is the Apple service that delivers push notifications from developers' servers to users' devices over a persistent, secure connection to the OS, without requiring the app to be running.

How it works, step by step:

1. The app calls `UIApplication.shared.registerForRemoteNotifications()`.
2. The system establishes a secure connection to APNs and receives a unique **device token**, the address APNs uses to find a specific device and app.
3. The token is delivered to the delegate method `application(_:didRegisterForRemoteNotificationsWithDeviceToken:)`; the app sends it to its own backend, which stores it.
4. When the server needs to send a notification, it builds a request (a JSON payload) and sends it to APNs over HTTP/2 through the **APNs Provider API**, authenticating with either a certificate or a JWT token based on a signing key (`.p8`).
5. APNs looks up the device by its device token and delivers the notification over the persistent connection, even if the app is not running or the device is asleep.
6. The system shows the notification (banner, sound, badge) according to the payload or, if `content-available: 1` is set, wakes the app in the background for a silent push.

```json
{
  "aps": {
    "alert": { "title": "New message", "body": "You have an unread message" },
    "sound": "default",
    "badge": 1
  }
}
```

Important details:

- the device token can change (reinstall, restore from backup, new device), so the app should update it on the server on every launch;
- `UNUserNotificationCenter` is responsible for handling and displaying the notification on the device;
- APNs has a **sandbox** environment for testing, separate from production.
