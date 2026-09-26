---
title: "С помощью какого инструмента в Swift Concurrency можно выполнить параллельную загрузку нескольких элементов, если заранее конкретное число этих элементов неизвестно?"
category: concurrency
order: 78
---

Группа задач: `withTaskGroup(of:returning:body:)` (или `withThrowingTaskGroup`, если задачи бросают ошибки). Она открывает область с динамическим числом дочерних задач: в цикле вызываете `group.addTask { ... }` для каждого элемента, а результаты собираете через `for await`.

```swift
func loadAll(_ urls: [URL]) async -> [Data] {
    await withTaskGroup(of: Data?.self) { group in
        for url in urls {
            group.addTask { try? await URLSession.shared.data(from: url).0 }
        }
        var result: [Data] = []
        for await data in group {
            if let data { result.append(data) }
        }
        return result
    }
}
```

Задачи выполняются конкурентно и могут завершаться в любом порядке; `withTaskGroup` возвращается только после завершения всех дочерних задач. `cancelAll()` сигналит об отмене, но задачи должны реагировать на неё кооперативно.
