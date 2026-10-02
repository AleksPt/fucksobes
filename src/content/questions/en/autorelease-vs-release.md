---
title: "What is the difference between autorelease and release?"
category: memory
order: 77
---

Both messages decrement the object's reference count, but at different moments.

- **`release`** decrements the retain count **immediately**. If the count reaches zero, the object is destroyed right away.
- **`autorelease`** does not decrement the count right away; it merely puts the object in the queue of the current `NSAutoreleasePool` (`@autoreleasepool` in Swift). The actual `release` is sent to the object **later**, when the pool is drained (usually at the end of the current run loop cycle).

```objc
NSObject *obj = [[NSObject alloc] init]; // retain count 1
[obj release];                            // retain count 0 immediately — the object is destroyed

NSObject *other = [[[NSObject alloc] init] autorelease]; // retain count 1
// the object is alive here and for some time afterwards,
// until the autorelease pool is drained
```

`autorelease` is needed when an object must "outlive" the current scope and be returned from a method as a result, but the calling code is not required to own it explicitly. The classic Objective-C example is factory methods like `[NSString stringWithFormat:]`, which return an autoreleased object instead of requiring the caller to call `release` manually.

In Swift with ARC, the compiler inserts both messages automatically, and `@autoreleasepool` itself is usually needed with Foundation objects only to manage peak memory in long loops that create many temporary Objective-C objects.
