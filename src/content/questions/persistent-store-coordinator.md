---
title: "Что делает NSPersistentStoreCoordinator?"
category: networking-storage
order: 18
---

основной стек Core Data:

- NSManagedObjectModel (managed object model)
- NSPersistentStoreCoordinator (persistent store coordinator)
- NSManagedObjectContext (managed object contexts).

**NSManagedObjectModel** — объектная модель данных. Содержит информацию обо всех моделях: какие атрибуты содержат эти модели и как они связаны друг с другом.

**NSPersistentStoreCoordinator** — координатор постоянного хранилища. Общается с постоянными хранилищами и гарантирует сохранение, загрузку и кэширование данных.

**NSManagedObjectContext** — управляет коллекцией объектов модели. Приложение может иметь несколько контекстов управляемого объекта. Каждый контекст опирается на NSPersistentStoreCoordinator (координатор постоянного хранилища).
