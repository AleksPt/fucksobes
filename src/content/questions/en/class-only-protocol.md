---
title: "How do you restrict a protocol to classes only (protocol: AnyObject)?"
category: swift
order: 130
---

To make only classes, and not structs and enums, able to conform to a protocol, you make it inherit from `AnyObject`:

```swift
protocol Delegate: AnyObject {
    func didFinish()
}

class ViewController: Delegate { func didFinish() {} }   // OK
struct Model: Delegate { func didFinish() {} }           // error
```

Previously this was written as `protocol P: class`; that form is considered deprecated in favor of `AnyObject`.

Why it's needed: for reference semantics and weak references. The property `weak var delegate: Delegate?` is allowed only for a type that is definitely a class, so delegates are declared class-only to avoid a retain cycle. In addition, instances of such a protocol can be compared by reference (`===`).
