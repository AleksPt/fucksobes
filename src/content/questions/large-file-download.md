---
title: "Какие есть способы скачать большой файл в iOS"
category: networking
order: 3
---

Большой файл скачивают через `URLSessionDownloadTask`: он пишет ответ сервера прямо во временный файл, а не копит его в памяти, отдаёт прогресс в делегат и позволяет приостановить загрузку и продолжить через `downloadTask(withResumeData:)`, если сервер это поддерживает.

Чтобы загрузка продолжалась при свёрнутом или выгруженном приложении, создают фоновую сессию: передачей занимается отдельный процесс, а по завершении система будит приложение и вызывает `application(_:handleEventsForBackgroundURLSession:completionHandler:)`.

```swift
let config = URLSessionConfiguration.background(withIdentifier: "com.example.downloads")
let session = URLSession(configuration: config, delegate: self, delegateQueue: nil)
let task = session.downloadTask(with: url)
task.resume()
```

Готовый файл доступен только внутри `urlSession(_:downloadTask:didFinishDownloadingTo:)`, поэтому его сразу перемещают в постоянное место. У фоновых сессий есть ограничения: обязателен делегат, только HTTP/HTTPS, редиректы всегда выполняются, а запуск новых задач из фона ограничивается rate limiter, поэтому лучше держать одну сессию и создавать в ней много задач.
