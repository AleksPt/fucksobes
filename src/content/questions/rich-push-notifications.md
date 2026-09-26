---
title: "Что такое Rich Push Notification?"
category: networking
order: 13
---

Rich Push Notification — уведомление с расширенным содержимым: изображением, GIF, видео или аудио, кнопками действий и собственным интерфейсом. Для этого используют два расширения приложения (App Extensions):

- **Notification Service Extension** (`UNNotificationServiceExtension`) — вызывается до показа уведомления. Он получает содержимое push, может изменить заголовок и текст, расшифровать данные, скачать медиафайл по URL и прикрепить его через `UNNotificationAttachment`. Сработает, если в payload есть `"mutable-content": 1`. На обработку даётся ограниченное время (около 30 секунд), после чего вызывается `serviceExtensionTimeWillExpire()`.
- **Notification Content Extension** (`UNNotificationContentExtension`) — отображает кастомный интерфейс при раскрытии уведомления; привязывается к категории через `UNNotificationExtensionCategory` в `Info.plist` и к `category` в payload.

Кнопки описывают через `UNNotificationCategory` и `UNNotificationAction`, зарегистрировав их в `UNUserNotificationCenter`.

```json
{ "aps": { "alert": { "title": "Новое фото" }, "mutable-content": 1, "category": "photo" },
  "image-url": "https://example.com/pic.jpg" }
```
