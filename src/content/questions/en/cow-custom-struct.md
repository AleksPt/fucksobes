---
title: "Can you implement Copy-on-Write for a custom struct?"
category: memory
order: 54
---

Yes. To do this, use a backing class to hold the data and a check on how many references point to it. The struct stores a reference to that class and, before any mutation, checks that it is the sole owner: `isKnownUniquelyReferenced(&storage)`. If there is more than one reference, a copy of the storage is made, and the changes are applied to that copy.

```swift
final class Storage { var items: [Int] }

struct MyArray {
    private var storage = Storage(items: [])

    mutating func append(_ x: Int) {
        if !isKnownUniquelyReferenced(&storage) {
            storage = Storage(items: storage.items)   // copy on write
        }
        storage.items.append(x)
    }
}
```

This way, copying on assignment costs `O(1)` (only the reference is copied), and a full copy is made only on the first write. The same approach is needed for your own hash table: the data buffer lives in a class, and before each mutation (insertion, removal, changing a value) a uniqueness check is performed. The standard `Array`, `Dictionary`, `Set`, and `String` are built exactly this way.
