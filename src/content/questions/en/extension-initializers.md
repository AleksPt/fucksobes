---
title: "Which initializers can we add in an extension?"
category: swift
order: 64
---

In an extension you can add new initializers to existing types, with restrictions for classes: an extension can add convenience initializers, while designated initializers and deinitializers must be in the original implementation of the class.

Two points matter for structs.

- An initializer in an extension does not disable the automatic initializers (default and memberwise); an initializer declared in the struct's body does. So if the body has no initializers of its own, an extension can call `self.init(...)` with the memberwise initializer (and `self.init()` if all properties have default values).
- If the struct is declared in another module, the new initializer must delegate to an initializer from the defining module before accessing `self`.

```swift
extension Rect {
    init(center: Point, size: Size) {
        let origin = Point(x: center.x - size.width / 2,
                           y: center.y - size.height / 2)
        self.init(origin: origin, size: size)
    }
}
```
