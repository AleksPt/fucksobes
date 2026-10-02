---
title: "What is NSFetchRequest? What is it used for?"
category: data-storage
order: 22
---

`NSFetchRequest` describes a Core Data query: which entity to load (`entity`) and how to filter the result. The main parameters:

- `predicate` — the filter condition (`NSPredicate`, for example `age > 18`);
- `sortDescriptors` — the sort order;
- `fetchLimit` and `fetchOffset` — a limit on the count and an offset;
- `fetchBatchSize` — the batch size Core Data loads when iterating over large results;
- `propertiesToFetch`, `relationshipKeyPathsForPrefetching` — which properties and relationships to load right away.

The request is executed through a context:

```swift
let request = NSFetchRequest<User>(entityName: "User")
request.predicate = NSPredicate(format: "age > %d", 18)
request.sortDescriptors = [NSSortDescriptor(key: "name", ascending: true)]
let users = try context.fetch(request)
```

This is the single way to read data, so a request is usually optimized with limits, batching, and indexes.
