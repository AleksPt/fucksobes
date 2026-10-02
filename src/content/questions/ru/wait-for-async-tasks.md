---
title: "Как запустить несколько асинхронных задач на concurrent очереди и дождаться их выполнения"
category: concurrency
order: 28
---

`DispatchGroup`

Через `DispatchGroup`: для каждой задачи вызывают `group.enter()`, а по её завершении `group.leave()` (или запускают задачу через `queue.async(group:)`). Дождаться можно синхронно, `group.wait()`, или асинхронно, `group.notify(queue:)`.

В `OperationQueue` аналогичного результата достигают через зависимости: создают операцию-завершение и делают её зависимой от остальных (`finish.addDependency(op)`), либо вызывают `waitUntilAllOperationsAreFinished()` (блокирует поток). С iOS 13 есть `addBarrierBlock(_:)`: блок выполнится после завершения всех ранее добавленных операций. В GCD похожая роль у `dispatch_barrier` и семафоров `DispatchSemaphore`.
