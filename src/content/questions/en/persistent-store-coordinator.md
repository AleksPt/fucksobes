---
title: "What does NSPersistentStoreCoordinator do?"
category: data-storage
order: 14
---

It is part of the core Core Data stack, which consists of `NSManagedObjectModel`, `NSPersistentStoreCoordinator`, and `NSManagedObjectContext`.

**`NSManagedObjectModel`** is the object data model. It contains information about all the models: which attributes they have and how they relate to each other.

**`NSPersistentStoreCoordinator`** is the persistent store coordinator. It talks to the persistent stores and takes care of saving, loading, and caching data.

**`NSManagedObjectContext`** manages a collection of model objects. An app can have several contexts, and each of them relies on a persistent store coordinator.
