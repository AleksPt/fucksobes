---
title: "Does ARC work with structs?"
category: memory
order: 68
---

A struct itself is not managed by ARC: it has no reference count, it is copied by value, and it lives wherever it is stored (the stack, inside another object, in an array buffer). But ARC does work with its contents: if the struct's fields are reference types (class instances, closures, and also the buffers of `Array`, `String`, `Dictionary`), then copying the struct performs a `retain` for each such field, and destroying the copy performs a `release`.

```swift
struct User {
    var name: String        // holds a reference to a buffer (for long strings)
    var tags: [String]      // reference to the array buffer
    var avatar: Image       // class: a reference
}
```

Every copy of `User` increments the counts of several objects. That is why a large struct with many reference fields is expensive to copy even though it looks like "just a value", while a struct made only of simple types (numbers, `Bool`) does not involve ARC at all. This is one reason to be careful with "fat" structs and to avoid unnecessary copies.
