---
title: "Что такое AsyncStream? Зачем он нужен?"
category: concurrency
order: 85
---

`AsyncStream` — тип, который превращает источник значений «в разные моменты времени» (колбэки, делегаты, уведомления) в `AsyncSequence`. Его потребляют циклом `for await`, поэтому работать с событиями можно в стиле `async/await`, без замыканий и подписок.

```swift
let stream = AsyncStream<Int> { continuation in
    let timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
        continuation.yield(Int.random(in: 0...9))
    }
    continuation.onTermination = { _ in timer.invalidate() }
}

for await value in stream { print(value) }
```

Через `continuation.yield` значения отправляют, а `finish()` завершает поток. У `onTermination` очищают ресурсы: он вызывается при завершении или отмене. `AsyncStream` не может бросать ошибку; для этого есть `AsyncThrowingStream`. Потребитель читает значения по очереди, а буферизацию настраивает параметр `bufferingPolicy`.
