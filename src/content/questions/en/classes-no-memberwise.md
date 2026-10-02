---
title: "Why don't classes have a memberwise initializer like structs do?"
category: swift
order: 107
---

For classes, Swift automatically creates only the parameterless initializer `init()`, and only if all stored properties have default values. There is no memberwise initializer for classes, for several reasons:

- **Inheritance.** A class may have a superclass with its own properties that must be initialized first (two-phase initialization). An automatic initializer that also covered the superclass's properties would be ambiguous and fragile: adding a property to the superclass would change the signature of every subclass.
- **Reference semantics.** Class instances are usually tied to identity and complex setup (resources, dependencies) rather than being a simple set of values. Structs more often just aggregate data, for which such an initializer is convenient.
- **Access control.** An automatically generated initializer would depend on the access levels of the properties, and the class could end up with an unpredictable interface.

For a struct, the memberwise initializer disappears if you declare any custom `init` inside the struct itself. You can keep it by declaring your own initializer in an `extension`. With classes, you have to write initializers by hand.
