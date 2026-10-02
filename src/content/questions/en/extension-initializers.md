---
title: "Which initializers can we add in an extension?"
category: swift
order: 64
---

In an extension you can add new initializers to existing types, with restrictions for classes: an extension can add convenience initializers, while designated initializers and deinitializers must be in the original implementation of the class.

There are two useful points for structs. If a value type provides default values for all stored properties and does not define any initializers of its own, then from an initializer in an extension you can call its default initializer and its memberwise initializer. If the struct is declared in another module, the new initializer must delegate to an initializer from the defining module before accessing `self`.

```swift
extension Rect {
    init(center: Point, size: Size) {
        let origin = Point(x: center.x - size.width / 2,
                           y: center.y - size.height / 2)
        self.init(origin: origin, size: size)
    }
}
```
