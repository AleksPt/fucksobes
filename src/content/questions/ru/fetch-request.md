---
title: "Что такое NSFetchRequest? Для чего его используют?"
category: data-storage
order: 22
---

`NSFetchRequest` описывает запрос к Core Data: какую сущность загрузить (`entity`) и как отобрать результат. Основные параметры:

- `predicate` — условие отбора (`NSPredicate`, например `age > 18`);
- `sortDescriptors` — порядок сортировки;
- `fetchLimit` и `fetchOffset` — ограничение количества и смещение;
- `fetchBatchSize` — размер порции, которую Core Data подгружает при обходе больших результатов;
- `propertiesToFetch`, `relationshipKeyPathsForPrefetching` — какие свойства и связи загрузить сразу.

Запрос выполняют через контекст:

```swift
let request = NSFetchRequest<User>(entityName: "User")
request.predicate = NSPredicate(format: "age > %d", 18)
request.sortDescriptors = [NSSortDescriptor(key: "name", ascending: true)]
let users = try context.fetch(request)
```

Это единый способ читать данные, поэтому запрос обычно оптимизируют лимитами, пакетной загрузкой и индексами.
