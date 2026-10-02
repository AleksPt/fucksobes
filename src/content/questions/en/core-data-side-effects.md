---
title: "What side effects are possible when working with Core Data?"
category: data-storage
order: 28
---

Core Data is convenient, but breaking its usage rules easily leads to non-obvious side effects.

- **Accessing an `NSManagedObject` from the wrong context/thread** — a crash or data corruption. Each `NSManagedObjectContext` is bound to its own queue, and objects should be passed between threads only by `objectID`, not directly.
- **An `NSManagedObject` "goes stale" (becomes a fault) after saving or merging changes** — accessing its properties afterwards either reloads the data from the store (extra I/O) or, if the object has already been deleted, crashes.
- **Memory leaks from a long-lived context** — `NSManagedObjectContext` caches all the objects it has loaded; if you don't call `reset()` or let the context be released, memory consumption keeps growing.
- **Cascading deletion by default** — if the delete rule (`Delete Rule`) for a relationship is not set explicitly, you can accidentally delete or nullify related objects you didn't think about when writing the code.
- **Races on concurrent saves** — several contexts writing to one `NSPersistentStoreCoordinator` at the same time can lead to merge conflicts (`merge conflict`) if no merge policy (`mergePolicy`) is configured.
- **Side effects of `save()`** — saving a context synchronously validates all changed objects; a validation error in one object cancels the save of the whole batch of changes.
- **Unnoticed database growth** — soft-delete via a flag instead of real deletion, forgotten temporary objects or unused relationships gradually bloat the store on disk.
- **A side effect of `NSFetchedResultsController`** — it actively notifies the UI about any change to the tracked objects, and a forgotten teardown or incorrectly configured `sectionNameKeyPath`/predicates lead to redundant table redraws. It also holds a strong reference to the delegate.

Most of these problems are solved by discipline: work with a context only on its own queue (`perform`/`performAndWait`), pass objects by `objectID`, set delete rules and the merge policy explicitly, and don't turn a single context into the data source for the entire app.
