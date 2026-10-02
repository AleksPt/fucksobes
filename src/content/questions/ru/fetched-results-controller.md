---
title: "Что такое NSFetchedResultsController? Для чего его используют?"
category: data-storage
order: 23
---

`NSFetchedResultsController` — контроллер, который выполняет `NSFetchRequest` и следит за изменениями результата в контексте. Когда объекты добавляются, удаляются или меняются, он сообщает об этом делегату (`NSFetchedResultsControllerDelegate`), чтобы точечно обновить интерфейс.

Он создан для списков в `UITableView` и `UICollectionView`: хранит результат, группирует его по секциям (`sectionNameKeyPath`), отдаёт количество секций и строк, объект по `IndexPath` и экономно подгружает данные порциями (`fetchBatchSize`).

```swift
let controller = NSFetchedResultsController(
    fetchRequest: request,
    managedObjectContext: context,
    sectionNameKeyPath: nil,
    cacheName: nil
)
controller.delegate = self
try controller.performFetch()
```

В SwiftUI аналог — `@FetchRequest`.
