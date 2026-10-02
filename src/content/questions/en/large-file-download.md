---
title: "What are the ways to download a large file in iOS?"
category: networking
order: 3
---

A large file is downloaded with `URLSessionDownloadTask`: it writes the server response straight to a temporary file instead of accumulating it in memory, reports progress to the delegate, and lets you pause the download and resume it with `downloadTask(withResumeData:)` if the server supports it.

To keep the download going while the app is suspended or terminated, you create a background session: a separate process handles the transfer, and when it finishes the system wakes the app and calls `application(_:handleEventsForBackgroundURLSession:completionHandler:)`.

```swift
let config = URLSessionConfiguration.background(withIdentifier: "com.example.downloads")
let session = URLSession(configuration: config, delegate: self, delegateQueue: nil)
let task = session.downloadTask(with: url)
task.resume()
```

The finished file is available only inside `urlSession(_:downloadTask:didFinishDownloadingTo:)`, so move it to a permanent location right away. Background sessions have limitations: a delegate is required, only HTTP/HTTPS is supported, redirects are always followed, and launching new tasks from the background is subject to a rate limiter, so it is better to keep one session and create many tasks in it.
