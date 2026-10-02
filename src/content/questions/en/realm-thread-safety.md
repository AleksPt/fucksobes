---
title: "Is Realm thread-safe?"
category: data-storage
order: 33
---

Both yes and no: Realm has a particular thread-safety model.

- The Realm **database file** itself is thread-safe: several threads can read and write to it at the same time, and Realm serializes writes through internal transactions.
- But **Realm objects** (`Object`, `Results`, and `Realm` itself) are **not** thread-safe and cannot be passed between threads directly. Each thread (or `DispatchQueue`) must have its own `Realm` instance, opened on that thread.

If you try to pass a Realm object into a closure that runs on another thread, the app crashes with a runtime error.

The right way to hand data between threads is to pass not the object itself but its `primaryKey` (or a `ThreadSafeReference`) and re-fetch the object on the target thread from its own `Realm` instance:

```swift
let ref = ThreadSafeReference(to: dog)

DispatchQueue.global().async {
    let realm = try! Realm()
    guard let dog = realm.resolve(ref) else { return } // the object may have been deleted
    // work with dog in the context of this thread
}
```
