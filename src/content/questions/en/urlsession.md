---
title: "What is URLSession? What is it used for?"
category: networking
order: 8
---

`URLSession` is the Foundation API for network requests over HTTP/HTTPS and other supported protocols: loading data, downloading and uploading files, and WebSocket tasks. A session manages a set of tasks (`URLSessionDataTask`, `URLSessionDownloadTask`, `URLSessionUploadTask`, `URLSessionWebSocketTask`).

For simple cases, the shared session `URLSession.shared` is enough. If you need custom settings (timeouts, cache, background downloads, extra headers), you create a session with a `URLSessionConfiguration` (`.default`, `.ephemeral`, `.background(withIdentifier:)`). For events such as authentication or progress, you set a delegate.

The modern way to make a call is the `async` method:

```swift
let (data, response) = try await URLSession.shared.data(from: url)
```
