---
title: "How do you implement message dispatch in practice?"
category: swift
order: 79
---

Mark a class member with the `dynamic` modifier together with `@objc`: access to it always goes through the Objective-C runtime and is never inlined or devirtualized.

```swift
class Base: NSObject {
    @objc dynamic func greet() -> String { "base" }
}
```

This way, a call to `greet()` compiles to `objc_msgSend`, and the implementation can be looked up by selector, for example through `perform(_:)`.
