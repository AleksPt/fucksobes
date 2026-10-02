---
title: "How do you create a base class in Swift?"
category: swift
order: 123
---

A base class in Swift is a class that does not inherit from another class: you simply declare it without a superclass.

```swift
class Animal {
    var name: String
    init(name: String) { self.name = name }
    func makeSound() {}
}

class Dog: Animal {
    override func makeSound() { print("Woof!") }
}
```

Unlike Objective-C and some other languages, Swift has no single universal root class: classes are not required to inherit from `NSObject`. You need to inherit from `NSObject` only when interoperability with Objective-C and Cocoa is required (KVO, `@objc`, selectors). To prevent inheritance from a base class, mark it `final`.
