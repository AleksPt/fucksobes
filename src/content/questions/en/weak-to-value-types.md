---
title: "Can you make a weak reference to an enum, struct, array, or dictionary?"
category: memory
order: 66
---

**In Swift, no.** The `weak` modifier (like `unowned`) applies only to class instances, that is, reference types (and protocols constrained to `AnyObject`). Structs, enums, arrays, and dictionaries are value types: they are copied, and a weak reference to a copy makes no sense. The compiler reports an error: `'weak' may only be applied to class and class-bound protocol types`.

If you need a weak reference to something inside a value type, wrap the value in a class or put the weak references themselves into a wrapper:

```swift
final class Box<T> { var value: T; init(_ value: T) { self.value = value } }

struct Weak<T: AnyObject> { weak var object: T? }
var list: [Weak<MyClass>] = []      // an array of weak references
```

**In Objective-C**, you can for `NSArray` and `NSDictionary` (and `NSMutable...`), because they are objects; you can also hold a weak reference to any object (`NSObject`). Primitives (`int`, `struct`) cannot be weak. For a collection that holds its elements weakly, there are `NSPointerArray` and `NSMapTable` with the `weakObjects` option.
