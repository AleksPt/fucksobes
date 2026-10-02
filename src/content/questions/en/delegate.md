---
title: "What is a Delegate? How do you use it?"
category: architecture
order: 35
---

Delegate is a pattern in which an object hands off part of its behavior, or notifies about events, to another object through a protocol. The owning object holds a reference to the delegate and calls its methods: for example, `UITableView` asks its `UITableViewDelegate` what to do when a row is selected.

```swift
protocol DownloaderDelegate: AnyObject {
    func downloader(_ d: Downloader, didFinishWith data: Data)
}

final class Downloader {
    weak var delegate: DownloaderDelegate?
    func finish(_ data: Data) { delegate?.downloader(self, didFinishWith: data) }
}
```

Rules: constrain the protocol to `AnyObject` and make the reference to the delegate `weak` to avoid a retain cycle. The method name usually includes the sender as the first parameter. A delegate suits a one-to-one relationship; for several receivers, use `NotificationCenter`, closures, or reactive streams.
