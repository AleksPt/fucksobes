---
title: "Что такое кооперативная отмена задач в Swift Concurrency?"
category: concurrency
order: 108
---

**Кооперативная отмена** — модель, в которой отмена не прерывает задачу принудительно. Вызов `task.cancel()` только выставляет задаче флаг «отменена», а сама задача должна проверять его и завершаться. Если код не проверяет флаг, он выполнится до конца.

Как это работает:

- флаг читается через `Task.isCancelled` (просто проверить) или `try Task.checkCancellation()` (выбросит `CancellationError`);
- многие системные `await`-функции (`URLSession.data`, `Task.sleep`) сами проверяют отмену и выбрасывают `CancellationError`;
- отмена **распространяется на дочерние задачи** (`async let`, `TaskGroup`);
- чтобы среагировать сразу (например, отменить сетевую задачу), используют `withTaskCancellationHandler`;
- освобождение ресурсов при отмене делают через `defer` или `catch`.

```swift
func processAll(_ items: [Item]) async throws {
    for item in items {
        try Task.checkCancellation() // выходим, если задачу отменили
        await process(item)
    }
}

let task = Task { try await processAll(items) }
task.cancel() // только просит остановиться, цикл сам увидит флаг
```
