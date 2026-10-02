---
title: "How does inheritance differ from composition?"
category: architecture
order: 48
---

**Inheritance**: a subclass gets the properties and methods of its superclass and adds its own. This is an "is-a" relationship: a passenger car is a car. The coupling is rigid: the subclass depends on the parent's implementation, and the hierarchy is fixed at design time.

**Composition**: an object includes other objects as its parts and delegates work to them. This is a "has-a" relationship: a car has an engine.

```swift
class Engine { let power: Int; init(power: Int) { self.power = power } }

class Car {
    let engine: Engine
    init(engine: Engine) { self.engine = engine }
}
```

Composition is more flexible: parts can be replaced and combined at runtime and through protocols, objects are more loosely coupled, and there are no fragile hierarchies or the problem of missing multiple inheritance. Hence the principle "favor composition over inheritance" (in Swift, protocols and extensions help with this).

Inheritance is appropriate when the subclass really is a subtype of the parent (the Liskov substitution principle), they come from the same domain, the ancestor's code suits the descendant, and the descendant mostly adds behavior. This is how the UIKit hierarchies (`UIViewController`, `UIView`) are built.
