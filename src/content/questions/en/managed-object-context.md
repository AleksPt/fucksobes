---
title: "What is NSManagedObjectContext? What is it used for?"
category: data-storage
order: 21
---

`NSManagedObjectContext` is Core Data's "workspace". It keeps in memory the objects you have loaded from the store or created, tracks their changes, and writes the changes to the store when `save()` is called. A context is connected to an `NSPersistentStoreCoordinator` (or a parent context) and talks to the store through it.

You use a context to create objects, execute an `NSFetchRequest`, delete objects, and roll back unsaved changes (`rollback()`). A context is not thread-safe: it is bound to its own queue, and you must work with it through `perform` or `performAndWait`. Typically you use `viewContext` (main queue, for the UI) and background contexts (`newBackgroundContext()`) for heavy work; changes from a background context are picked up by the main one through `automaticallyMergesChangesFromParent`.
