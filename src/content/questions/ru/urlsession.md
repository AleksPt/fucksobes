---
title: "Что такое URLSession? Для чего его используют?"
category: networking
order: 8
---

`URLSession` — API Foundation для сетевых запросов по HTTP/HTTPS и другим поддерживаемым протоколам: загрузки данных, скачивания и отправки файлов, а также WebSocket-задач. Сессия управляет набором задач (`URLSessionDataTask`, `URLSessionDownloadTask`, `URLSessionUploadTask`, `URLSessionWebSocketTask`).

Для простых случаев подходит общая сессия `URLSession.shared`. Если нужна своя настройка (таймауты, кэш, фоновая загрузка, дополнительные заголовки), сессию создают с `URLSessionConfiguration` (`.default`, `.ephemeral`, `.background(withIdentifier:)`). Для событий вроде аутентификации или прогресса задают делегат.

Современный вариант вызова — `async`-метод:

```swift
let (data, response) = try await URLSession.shared.data(from: url)
```
