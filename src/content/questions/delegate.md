---
title: "Что такое Delegate? Как его использовать?"
category: architecture
order: 35
---

Delegate — паттерн, в котором объект передаёт часть своего поведения или уведомляет о событиях другой объект через протокол. Объект-владелец хранит ссылку на делегата и вызывает его методы: например, `UITableView` спрашивает у `UITableViewDelegate`, что делать при выборе строки.

```swift
protocol DownloaderDelegate: AnyObject {
    func downloader(_ d: Downloader, didFinishWith data: Data)
}

final class Downloader {
    weak var delegate: DownloaderDelegate?
    func finish(_ data: Data) { delegate?.downloader(self, didFinishWith: data) }
}
```

Правила: протокол ограничивают `AnyObject`, а ссылку на делегата делают `weak`, чтобы не было retain cycle. Название метода обычно включает отправителя первым параметром. Делегат подходит для связи один-к-одному; для нескольких получателей используют `NotificationCenter`, замыкания или реактивные потоки.
