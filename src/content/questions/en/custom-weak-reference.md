---
title: "How would you make a custom weak reference?"
category: memory
order: 79
---

`weak` is not just a modifier but functionality built into the compiler and runtime (it uses a side table for zeroing weak references), so you cannot create a *real* `weak` by hand. But you can write a wrapper that behaves like a weak reference, using the existing ARC mechanism.

The simplest way is a generic class with a `weak` property inside:

```swift
final class Weak<T: AnyObject> {
    weak var value: T?

    init(_ value: T?) {
        self.value = value
    }
}
```

Such a wrapper is handy, for example, for storing weak references in collections, since `Array`/`Dictionary` cannot store `weak` directly:

```swift
var observers: [Weak<SomeObserver>] = []
observers.append(Weak(observer))

// by the time of access, the object may already have been freed
observers.compactMap { $0.value }.forEach { $0.notify() }
```

There is also a lower-level path: using `Unmanaged`/`unsafeBitCast` to work with a pointer directly without incrementing the reference count, but this is an `unsafe` API: the compiler does not guarantee that the object won't be freed and the pointer won't become dangling. For ordinary tasks, a wrapper with a `weak` property is enough.
