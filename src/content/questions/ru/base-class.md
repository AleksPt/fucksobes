---
title: "Как создать базовый класс в Swift?"
category: swift
order: 123
---

Базовым классом в Swift считается класс, который не наследуется от другого: достаточно объявить его без суперкласса.

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

В отличие от Objective-C и некоторых других языков, в Swift нет единого универсального корневого класса: классы не обязаны наследоваться от `NSObject`. Наследоваться от `NSObject` нужно, только если требуется взаимодействие с Objective-C и Cocoa (KVO, `@objc`, селекторы). Чтобы запретить наследование от базового класса, его помечают `final`.
