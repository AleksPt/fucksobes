---
title: "How do you intercept the calls of all classes in a closed-source library?"
category: swift
order: 88
---

Through swizzling: find the library's classes and replace their methods with wrappers that record the call and pass control to the original implementation.

1. **The library's classes.** `class_getImageName(_:)` returns the name of the dynamic library a class came from, and `objc_copyClassNamesForImage(_:_:)` returns the names of all classes in that library or framework. `objc_copyClassList(_:)` gives the list of all registered classes, but for a third-party library it is more convenient to limit yourself to its image.
2. **The class's methods.** `class_copyMethodList(_:_:)` returns the instance methods of the class itself (those inherited from superclasses are not included); class methods are taken from the metaclass: `object_getClass(cls)`. The returned array must be freed with `free()`.
3. **Replacement.** `method_setImplementation(_:_:)` replaces the implementation, and `method_exchangeImplementations(_:_:)` atomically swaps two implementations. In the wrapper you write a log entry and call the original implementation.

```swift
guard let image = class_getImageName(DateFormatter.self) else { return }

var nameCount: UInt32 = 0
if let names = objc_copyClassNamesForImage(image, &nameCount) {
    defer { free(names) }
    for i in 0..<Int(nameCount) {
        guard let cls = NSClassFromString(String(cString: names[i])) else { continue }
        var methodCount: UInt32 = 0
        if let methods = class_copyMethodList(cls, &methodCount) {
            defer { free(methods) }
            // for each methods[j] you can install a wrapper here via method_setImplementation
        }
    }
}
```

Limitation: this intercepts only calls that go through the Objective-C runtime (message dispatch). For Swift members, runtime access is guaranteed by the `dynamic` modifier together with `@objc`.
