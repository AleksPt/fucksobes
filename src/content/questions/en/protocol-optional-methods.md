---
title: "Can protocols have optional functions?"
category: swift
order: 54
---

Yes, but optional functions can only be used in **protocols marked `@objc`** (Objective-C compatible): the optional-method mechanism is borrowed from Objective-C. Such functions are declared as `@objc optional`.

```swift
@objc protocol Delegate {
    @objc optional func didFinish()
}
// it must be called with a check: delegate?.didFinish?()
```

The drawbacks of this approach: only classes can conform to the protocol (structs and enums cannot), and before calling you need to check whether the method is implemented.

The pure Swift alternative is a **default implementation in a protocol extension**:

```swift
protocol Delegate { func didFinish() }

extension Delegate {
    func didFinish() {}   // a type may skip implementing the method
}
```

Pros: it works for classes, structs, and enums, supports generics, and the call needs no check because an implementation always exists. Cons: not every method has a universal default implementation, and from a call you cannot tell the default implementation from the absence of a custom one. A method declared in the protocol is called dynamically (witness table), while a method added only in an extension is dispatched statically.
