---
title: "Задача: исправить race condition в коде с DispatchGroup и общим счётчиком"
category: concurrency
order: 94
---

Код: две задачи в глобальной очереди увеличивают общую переменную `count` по 10 000 раз, `DispatchGroup` ждёт их завершения.

```swift
var count = 0
let group = DispatchGroup()

for _ in 0..<2 {
    group.enter()
    DispatchQueue.global().async {
        for _ in 0..<10_000 { count += 1 }   // гонка данных
        group.leave()
    }
}
group.notify(queue: .global()) { print(count) }   // непредсказуемо, меньше 20000
```

`count += 1` — это чтение, увеличение и запись, а два потока делают это одновременно, поэтому часть инкрементов теряется. Результат может быть разным при каждом запуске. Решение — сделать доступ к `count` взаимоисключающим. Например, мьютексом:

```swift
let lock = NSLock()
group.enter()
DispatchQueue.global().async {
    for _ in 0..<10_000 {
        lock.lock(); count += 1; lock.unlock()
    }
    group.leave()
}
```

Не забывают `group.leave()` для каждого `enter()`: иначе `notify` никогда не сработает. Другие варианты: последовательная очередь (`serial.sync { count += 1 }`), `DispatchSemaphore(value: 1)`, атомарные операции, актор в Swift Concurrency или вообще отказ от общей переменной: каждая задача считает свой локальный результат, а итог суммируют после `notify`. Ожидаемый ответ — `20000`.
