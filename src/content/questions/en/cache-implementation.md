---
title: "How would you implement a cache?"
category: memory
order: 78
---

For an in-memory cache, Foundation has a ready-made tool: **`NSCache`**. It behaves like a mutable "key → value" dictionary, with one important difference: when the device runs low on memory, the system **automatically evicts** some of the objects from the cache on its own, without any explicit involvement from your code and without the usual `didReceiveMemoryWarning`.

```swift
let cache = NSCache<NSString, UIImage>()

func image(for key: String) -> UIImage? {
    if let cached = cache.object(forKey: key as NSString) {
        return cached // already in the cache — return it right away
    }

    guard let loaded = loadExpensiveImage(for: key) else { return nil }
    cache.setObject(loaded, forKey: key as NSString)
    return loaded
}
```

Useful settings:

- `countLimit` — the maximum number of items;
- `totalCostLimit` — a limit on "cost" (for example, the total size of the data in bytes), which you specify on insertion (`setObject(_:forKey:cost:)`);
- `NSCache` is thread-safe out of the box, unlike a plain `Dictionary`;
- keys and values must be classes (`NSString`, `NSObject`-compatible), so value types like `String` are wrapped in `NSString`, and for your own structs a wrapper class works.

If you need a cache with more specific behavior (LRU with a fixed limit and predictable eviction, persistence to disk, per-entry TTL), you write your own layer on top of `NSCache` or instead of it: for example, a dictionary plus a linked list for LRU, or a combination of `NSCache` (a fast in-memory layer) and writing to disk (`FileManager`, Core Data, SQLite) as a second-level source.

It is important not to confuse `NSCache` with `URLCache`: the latter caches `URLSession` HTTP responses and is configured separately (`URLSessionConfiguration.requestCachePolicy`, `URLCache.shared`).
