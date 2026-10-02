---
title: "How can you influence dispatch?"
category: swift
order: 83
---

Classes use dynamic dispatch by default: an indirect call through the vtable. You can influence it as follows:

- `final` on a class, method, or property prohibits overriding, and the compiler can call the implementation directly;
- `private` / `fileprivate` limit visibility to the file; if there are no overrides in the file, the compiler infers `final` itself;
- whole-module optimization lets the compiler infer `final` for `internal` declarations that have no overrides in the module;
- `dynamic` does the opposite: calls go through Objective-C message sending, which is slower than a direct call.

```swift
final class C {
    var array: [Int] = []
    func doSomething() {}   // direct call
}

class D {
    final var array1: [Int] = []  // direct access
    var array2: [Int] = []        // through the vtable
}
```

For inlining (substituting a function body at the call site) there are attributes: `@inline(__always)` asks the compiler to always inline the body (a strong hint, but not an absolute guarantee: for example, recursive functions cannot be inlined), `@inline(never)` prohibits inlining, and `@inlinable` exposes a function's body for optimization in other modules. Without `final` and without a known exact type, the compiler cannot inline a class method, so `final`, `private`, and whole-module optimization help inlining too. `dynamic` methods cannot be inlined.
