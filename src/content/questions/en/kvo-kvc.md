---
title: "What are KVO and KVC? What are they used for?"
category: swift
order: 90
---

**KVC** (Key-Value Coding) is a mechanism for accessing an object's properties by a string key rather than directly: `object.value(forKey: "name")` and `object.setValue(_, forKey:)`. It works with `NSObject` subclasses and properties exposed to Objective-C. Keys can be composed into paths (`"address.city"`).

**KVO** (Key-Value Observing) is a mechanism for subscribing to changes of an object's property. For it to work in Swift, the class must inherit from `NSObject`, and the observed property must be marked `@objc dynamic`.

```swift
class Person: NSObject { @objc dynamic var name = "" }

let person = Person()
let token = person.observe(\.name, options: [.old, .new]) { _, change in
    print(change.oldValue ?? "", "→", change.newValue ?? "")
}
```

You must keep the subscription token: when it is deallocated, observation stops. In Swift, `KeyPath` is used instead of strings, which is more type-safe. The mechanism is used in Cocoa classes (for example, `AVPlayer`, `UIScrollView.contentOffset`) and as the basis for bindings. For native Swift types, `@Observable`, Combine (`@Published`), and `didSet` are more often chosen instead.
