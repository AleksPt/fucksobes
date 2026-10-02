---
title: "Does Core Data guarantee thread safety?"
category: data-storage
order: 15
---

No: not all Core Data objects are thread-safe.

- A context (`NSManagedObjectContext`) and the `NSManagedObject`s fetched from it are bound to the queue the context was created on. Work with them through `perform` / `performAndWait`.
- Managed objects must not be passed between queues: this can corrupt data and crash the app. Pass the object's `objectID` instead and fetch the object by it in the other context.
- Use a private-queue context for background work and a main-queue context for the UI.
