---
title: "Как устроены CheckedContinuation и UnsafeContinuation и когда их использовать вручную?"
category: concurrency
order: 110
---

`CheckedContinuation<T, E>` и `UnsafeContinuation<T, E>` — низкоуровневый мост между асинхронным миром (`async/await`) и колбэк-based API. Оба позволяют вручную приостановить `async`-функцию и возобновить её позже из произвольного места — например, из делегата или completion handler'а старого API.

Получают их через `withCheckedContinuation`/`withCheckedThrowingContinuation` и `withUnsafeContinuation`/`withUnsafeThrowingContinuation`: Swift приостанавливает выполнение и отдаёт `continuation`, который нужно вызвать **ровно один раз** для возобновления.

```swift
func loadData() async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        legacyAPI { data, error in
            if let data {
                continuation.resume(returning: data)
            } else {
                continuation.resume(throwing: error ?? MyError.unknown)
            }
        }
    }
}
```

Разница между ними:

- **`CheckedContinuation`** делает runtime-проверки: если `continuation` был уничтожен без вызова `resume` (задача повиснет навсегда), пишет в консоль предупреждение `leaked its continuation without resuming it`, а при вызове `resume` больше одного раза аварийно завершает приложение.
- **`UnsafeContinuation`** — без этих проверок, быстрее, но опаснее: забытый вызов `resume()` тихо подвешивает задачу навсегда, а двойной вызов приводит к неопределённому поведению (undefined behavior) без внятного сообщения об ошибке.

Когда использовать: `CheckedContinuation` — основной выбор для интеграции с callback-based API и для отладки, пока не уверены, что оборачивание корректно. `UnsafeContinuation` оправдан только в горячем пути, где нужна максимальная производительность и уже **точно доказано**, что `resume()` вызывается ровно один раз.
