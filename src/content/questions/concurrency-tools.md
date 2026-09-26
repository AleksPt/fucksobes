---
title: "Какие способы работы с многопоточкой ты знаешь?"
category: concurrency
order: 2
---

- **Потоки** (`Thread`, POSIX threads): низкоуровневый инструмент, которым нужно управлять вручную.
- **GCD** (`DispatchQueue`, `DispatchGroup`, `DispatchSemaphore`): задачи отправляются в очереди, потоками управляет система.
- **Операции** (`Operation`, `OperationQueue`): задачи как объекты с зависимостями и KVO-уведомлениями.
- **Swift Concurrency**: `async`/`await`, `Task`, акторы (`actor`, `@MainActor`), изоляция данных для защиты от гонок.
