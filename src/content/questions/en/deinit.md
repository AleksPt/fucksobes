---
title: "What is a deinitializer (deinit)? How do you create one?"
category: swift
order: 126
---

A deinitializer is a special class method, `deinit`, that is called automatically right before an instance is deallocated (when the ARC reference count reaches zero). It is used for cleanup: unsubscribing from notifications and observers, stopping a timer, closing a file or connection.

```swift
class Example {
    init() { print("created") }
    deinit { print("destroyed") }
}

var e: Example? = Example()
e = nil    // prints "destroyed"
```

Specifics: it exists only for classes (not for structs and enums), takes no parameters and has no parentheses, and cannot be called manually. A superclass's deinitializer is called automatically after the subclass's deinitializer. You don't need to free the memory yourself: ARC does it for you. If `deinit` is not called when a screen is closed or an object is destroyed, that is a sign of a leak, most often a retain cycle.
