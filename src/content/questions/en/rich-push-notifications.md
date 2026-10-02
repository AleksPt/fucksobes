---
title: "What is a Rich Push Notification?"
category: networking
order: 13
---

A Rich Push Notification is a notification with extended content: an image, GIF, video or audio, action buttons, and a custom interface. It is built with two app extensions:

- **Notification Service Extension** (`UNNotificationServiceExtension`) — called before the notification is shown. It receives the push content, can change the title and body, decrypt data, download a media file from a URL and attach it via `UNNotificationAttachment`. It runs only if the payload contains `"mutable-content": 1`. Processing time is limited (about 30 seconds), after which `serviceExtensionTimeWillExpire()` is called.
- **Notification Content Extension** (`UNNotificationContentExtension`) — displays a custom interface when the notification is expanded; it is tied to a category through `UNNotificationExtensionCategory` in `Info.plist` and to `category` in the payload.

Buttons are described with `UNNotificationCategory` and `UNNotificationAction`, registered in `UNUserNotificationCenter`.

```json
{ "aps": { "alert": { "title": "New photo" }, "mutable-content": 1, "category": "photo" },
  "image-url": "https://example.com/pic.jpg" }
```
