---
title: "Initialization, inheritance and access control"
order: 3
---

> **What you'll learn**
>
> - What kinds of initializers there are: default, memberwise, designated, convenience, required, failable
> - How two-phase initialization works and the 4 safety checks
> - The rules of initializer delegation and inheritance
> - `override`, `super`, `final`, `required`
> - 6 access levels: `open`, `public`, `package`, `internal`, `fileprivate`, `private`

> **Prerequisites:** [tutorial 01](../structs-classes-enums/) — struct, class, `deinit`; [tutorial 02](../properties-wrappers/) — properties.

## Analogy: building a house

Initialization is a construction project.

- **Phase 1** — you put up the shell: each floor (a class in the hierarchy) gets its own walls and ceilings. You can't live in the house yet.
- **Phase 2** — finishing and furniture: now you can switch on the light, call methods and configure what has already been built.
- **Designated init** — the main crew: it fully builds its own floor and calls the crew of the floor below.
- **Convenience init** — a designer with a ready-made plan: builds nothing itself, but orders a crew from a template.

## Step 1. Kinds of initializers

| Kind | What it does |
| --- | --- |
| Default | `init()` is created automatically if all properties have default values and there are no custom initializers |
| Memberwise | for structs: `init(a:b:)` over all stored properties |
| Designated | the main initializer of a class: initializes all of its own properties and calls `super.init` |
| Convenience | secondary: must call another initializer of **the same class** (`self.init`) |
| Failable (`init?`) | may return `nil` |
| Required | mandatory in every subclass |

```swift
class Animal {
    var numberOfLegs: Int

    init(numberOfLegs: Int) {                  // designated
        self.numberOfLegs = numberOfLegs
    }

    convenience init(type: String) {           // convenience
        let number = type == "bird" ? 2 : 4
        self.init(numberOfLegs: number)
    }
}

class Wolf: Animal {
    var hasFur: Bool

    init(hasFur: Bool) {                       // the subclass's designated
        self.hasFur = hasFur                   // 1) its own properties
        super.init(numberOfLegs: 4)            // 2) up the chain
    }
}
```

**Failable.** An example: an initializer that fails on invalid data.

```swift
struct PhoneNumber {
    let value: String
    init?(_ value: String) {
        guard value.count >= 11, value.allSatisfy(\.isNumber) else { return nil }
        self.value = value
    }
}
let ok = PhoneNumber("79991234567")   // PhoneNumber?
let bad = PhoneNumber("12")           // nil
```

**Required.** A subclass must implement such an initializer; you don't write `override` in this case, but you do write `required`.

```swift
class UserScreen {
    var title: String
    required init(title: String) { self.title = title }
}
class ProfileScreen: UserScreen {
    var backgroundColor: String
    init(backgroundColor: String) {
        self.backgroundColor = backgroundColor
        super.init(title: "Profile screen")
    }
    required init(title: String) {          // mandatory
        backgroundColor = "black"
        super.init(title: title)
    }
}
```

## Step 2. Two-phase initialization

> **Phase 1** — every stored property of every class in the hierarchy gets an initial value, going from the bottom up along the `super.init` chain. **Phase 2** — going back, each class can customize the instance: call methods, change inherited properties, use `self`.

**The compiler's 4 safety checks:**

1. A designated init must initialize **all of its own** properties before calling `super.init`.
2. An inherited property can only be changed **after** `super.init`.
3. A convenience init must call another init (`self.init`) **before** assigning any properties.
4. You cannot call instance methods, read properties or use `self` as a value until phase 1 is complete.

```swift
class Vehicle {
    var wheels: Int
    init(wheels: Int) { self.wheels = wheels }
}
class Bicycle: Vehicle {
    var hasBasket: Bool
    init(hasBasket: Bool) {
        self.hasBasket = hasBasket      // phase 1: its own properties
        super.init(wheels: 2)           // phase 1 for the parent
        wheels = 2                      // phase 2: now you can change the inherited property
    }
}
```

<details>
<summary>Why can't you call a method before super.init?</summary>

Until the parent part is initialized, `self` is not fully ready. A method could read an uninitialized property or call a subclass's overridden method that accesses fields that haven't been created yet. Two-phase initialization rules out such situations at compile time.

</details>

## Step 3. Initializer delegation and inheritance

**Delegation rules:**

- a designated init **calls up** (`super.init`), and only the parent's designated initializer;
- a convenience init **calls across** (`self.init`) — ultimately it always arrives at a designated one;
- a designated init **cannot** call another designated init's `self.init`.

![The subclass's convenience initializer calls self.init on its own designated initializer. The subclass's designated initializer calls super.init on the superclass's designated initializer. The superclass's convenience initializer calls self.init on its own designated initializer.](../../../../assets/tutorials/en/swift/03-init-delegation.svg)

**A struct's memberwise initializer.** If you declare your own `init` inside the struct, the memberwise one disappears. A custom `init` in an `extension` keeps both:

```swift
struct User {
    var name: String
    var age: Int
}
extension User {
    init(name: String) { self.init(name: name, age: 0) }
}
let u1 = User(name: "Anna", age: 30)   // memberwise is still available
let u2 = User(name: "Bob")
```

The memberwise initializer has the `internal` level by default (even for a `public` struct): from another module you cannot create such a struct without your own `public init`.

**Delegation in structs** is just `self.init(...)`, with no split into designated and convenience:

```swift
struct Device {
    let serialNumber: String
    init(serialNumber: String) { self.serialNumber = serialNumber }
    init(old: OldDevice) { self.init(serialNumber: old.serialNumber) }
}
struct OldDevice { let serialNumber: String }
```

## Step 4. override, super, final

- **`override`** — states explicitly that you are overriding a parent's member; the compiler checks that such a member exists.
- **`super`** — access to the parent's implementation from a subclass.
- **`final`** — forbids overriding a method, property or subscript; on a class, it forbids inheritance.
- **`static`** on a class member is `class final`.

```swift
class Base {
    func greet() -> String { "base" }
    final func id() -> Int { 1 }      // cannot be overridden
}
class Derived: Base {
    override func greet() -> String { super.greet() + " + derived" }
    // override func id() — compile error
}
print(Derived().greet())   // base + derived
```

`final` also speeds up calls: the compiler can pick static dispatch ([tutorial 09](../dispatch-objc-runtime/)).

## Step 5. Access levels

| Level | Access | Inherit / override |
| --- | --- | --- |
| `open` | from any module | anywhere, including other modules |
| `public` | from any module | only within its own module |
| `package` | within one package (SwiftPM) | within the package |
| `internal` (default) | within its own module | within the module |
| `fileprivate` | within its own file | — |
| `private` | within the declaration and its extensions in the same file | — |

```swift
public class Networking {
    public private(set) var requestCount = 0   // can be read from outside, can't be written
    fileprivate func log(_ s: String) { }
    private func secret() { }
}
```

- **`open`** works only for classes and their members. It is exactly what a framework needs whose classes are subclassed by clients.
- An entity cannot be **more accessible** than the types it uses: `public func f(_ x: InternalType)` is an error.
- `private(set)` is a separate level for the setter: broader to read, narrower to write.
- `@testable import` lets tests see `internal`.

## Common mistakes

- Calling a method or touching `self` before `super.init`.
- Declaring `init` inside a struct and losing memberwise.
- Forgetting `required` on an override of a `required init`.
- Expecting convenience initializers to be inherited when the subclass has its own designated one.
- Making a public API `public` instead of `open` and being surprised that clients can't subclass.
- Exposing a `public` type with an `internal` dependency.
- Forgetting that `private` is not visible from another file, even for an extension.

<details>
<summary>A tricky question: how many phases does initialization have, and why?</summary>

Two. The first guarantees that all properties of all classes in the hierarchy have received values, the second lets you safely use `self`. This prevents access to uninitialized memory and accidental overwriting of a value by another initializer.

</details>

## Cheat sheet

```swift
init(...) { }                  // designated
convenience init(...) { self.init(...) }
init?(...) { return nil }      // failable
required init(...) { }         // mandatory in subclasses

// order in a subclass's designated:
// 1) its own properties  2) super.init(...)  3) the rest (phase 2)

final class A { }              // cannot be inherited
override func f() { super.f() }

// access: open > public > package > internal > fileprivate > private
public private(set) var x = 0
```

## Self-check questions

<details>
<summary>1. How does designated differ from convenience?</summary>

A designated initializer fully initializes its own properties and calls `super.init`. A convenience one must call another initializer of the same class and ultimately reach a designated one.

</details>

<details>
<summary>2. What is two-phase initialization?</summary>

Phase 1 — all properties get values, from the subclass to the parent. Phase 2 — customizing the instance, using `self`, calling methods.

</details>

<details>
<summary>3. When are initializers inherited?</summary>

If a subclass declares no designated initializers of its own, it inherits all of the parent's designated ones; if it inherits or overrides all of them, it gets the convenience ones too.

</details>

<details>
<summary>4. How do you keep the memberwise initializer when adding your own?</summary>

Declare your own `init` in an `extension`.

</details>

<details>
<summary>5. How does open differ from public?</summary>

Both are accessible from other modules. `open` allows subclassing and overriding outside the module, `public` does not.

</details>

<details>
<summary>6. What does final give you?</summary>

It forbids inheritance and overriding, and therefore allows static dispatch.

</details>

<details>
<summary>7. What does private(set) do?</summary>

It lets a property be read more widely than it is written: the setter is private.

</details>

## Sources

- [Initialization — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [Inheritance — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [SE-0386: New access modifier — package](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0386-package-access-modifier.md)
