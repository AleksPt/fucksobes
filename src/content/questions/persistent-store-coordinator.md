---
title: "Что делает NSPersistentStoreCoordinator?"
category: data-storage
order: 14
---

Это часть основного стека Core Data, в который входят `NSManagedObjectModel`, `NSPersistentStoreCoordinator` и `NSManagedObjectContext`.

**`NSManagedObjectModel`** — объектная модель данных. Содержит информацию обо всех моделях: какие атрибуты они содержат и как связаны друг с другом.

**`NSPersistentStoreCoordinator`** — координатор постоянного хранилища. Общается с постоянными хранилищами и обеспечивает сохранение, загрузку и кэширование данных.

**`NSManagedObjectContext`** — управляет коллекцией объектов модели. У приложения может быть несколько контекстов, и каждый опирается на координатор постоянного хранилища.
