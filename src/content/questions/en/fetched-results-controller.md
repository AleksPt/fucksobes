---
title: "What is NSFetchedResultsController? What is it used for?"
category: data-storage
order: 23
---

`NSFetchedResultsController` is a controller that executes an `NSFetchRequest` and tracks changes to the result in the context. When objects are added, removed, or changed, it notifies its delegate (`NSFetchedResultsControllerDelegate`) so that the UI can be updated surgically.

It was built for lists in `UITableView` and `UICollectionView`: it holds the result, groups it into sections (`sectionNameKeyPath`), provides the number of sections and rows and the object for an `IndexPath`, and loads data economically in batches (`fetchBatchSize`).

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

In SwiftUI the counterpart is `@FetchRequest`.
