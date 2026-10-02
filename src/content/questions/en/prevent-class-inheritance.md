---
title: "Can you prevent inheritance from a class?"
category: swift
order: 39
---

Yes: the `final` modifier before `class` prevents creating subclasses. Applied to a property, method, or subscript of a class, it prevents overriding them in subclasses; an attempt to override results in a compile-time error.

```swift
final class Base {}
// class Derived: Base {}  // error: cannot inherit from a final class
```
