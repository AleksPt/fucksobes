---
title: "Что такое Publisher/Subscriber?"
category: concurrency
order: 83
---

Это основные роли фреймворка Combine. `Publisher` — источник значений во времени: он может издать ноль или больше значений и завершиться успехом либо ошибкой. `Subscriber` — получатель, который подписывается на publisher и обрабатывает значения. Подписка (`Subscription`) связывает их и позволяет получателю запрашивать значения порциями (backpressure).

Между источником и получателем ставят операторы (`map`, `filter`, `debounce`, `combineLatest`), а стандартные подписчики — это `sink` и `assign(to:on:)`. Подписку возвращает `AnyCancellable`: пока объект хранится, подписка активна, а при его освобождении подписка отменяется.

```swift
var cancellables = Set<AnyCancellable>()
[1, 2, 3].publisher
    .map { $0 * 2 }
    .sink { print($0) }
    .store(in: &cancellables)
```
