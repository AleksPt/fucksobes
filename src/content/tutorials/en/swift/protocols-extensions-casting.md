---
title: "Protocols, extensions and type casting"
order: 7
---

> **What you'll learn**
>
> - What a protocol can require and how to give it a default implementation
> - Protocol composition, class-only (`AnyObject`), `@objc optional`
> - The Delegate pattern and why `delegate` is made `weak`
> - What you can and can't add in an `extension`
> - `is`, `as`, `as?`, `as!`, `Any` and `AnyObject`
> - More operators: bitwise, overflow operators, custom operators

> **Prerequisites:** [tutorial 01](../structs-classes-enums/) (struct, class), [tutorial 03](../init-inheritance-access/) (initializers, access control).

## Analogy: a job description

- **Protocol** — a description of "what an employee must be able to do". How exactly they do it is up to each person.
- **Extension** — a clearance for a new position: the person gains a new skill, but there are no new fields in their employment record.
- **Delegate** — you left a colleague a phone number: "call me when it's ready". You don't know who they are, only that they have the number.
- **Type casting** — a badge check: "is this really an accountant?"

## Step 1. Protocol requirements

> **Protocol** — a blueprint of requirements (properties, methods, initializers, subscripts, associated types). Structs, classes and enums "adopt" a protocol and implement the requirements.

```swift
protocol Drawable {
    var name: String { get }                 // read-only
    var lineWidth: Double { get set }        // read and write
    static var kind: String { get }          // a requirement on the type
    mutating func scale(by factor: Double)   // mutating — for structs
    func draw() -> String
    init(name: String)
}

struct Circle: Drawable {
    let name: String
    var lineWidth = 1.0
    static let kind = "circle"
    init(name: String) { self.name = name }
    mutating func scale(by factor: Double) { lineWidth *= factor }
    func draw() -> String { "○ \(name)" }
}
```

Rules:

- you can't specify default values in the parameters of protocol methods (it is done through an `extension`);
- if a protocol requires an `init`, in a class its implementation is `required init` (unless the class is `final`);
- protocols can inherit from other protocols and be composed with `&`.

```swift
protocol Named { var name: String { get } }
protocol Aged { var age: Int { get } }
protocol Person: Named, Aged { }          // protocol inheritance

func greet(_ x: Named & Aged) {            // composition
    print("\(x.name), \(x.age)")
}
```

## Step 2. Default implementation through an extension

```swift
protocol Greeter {
    var name: String { get }
    func greet() -> String          // a protocol requirement
}

extension Greeter {
    func greet() -> String { "Hello, \(name)" }   // default implementation
    func shout() -> String { greet().uppercased() }   // NOT a requirement, just an added method
}

struct Guest: Greeter { let name: String }
print(Guest(name: "Anna").greet())   // Hello, Anna
```

> **A trap.** Methods in an `extension` that are **not in the protocol's requirements** are called by the **static type**. If the expression's type is `Greeter`, the extension's implementation will be called, even if the concrete type declared its own method with the same name. In detail and with exercises — in [tutorial 09](../dispatch-objc-runtime/).

**Constraining a protocol extension with `where`:**

```swift
extension Collection where Element: Equatable {
    func allEqual() -> Bool {
        guard let first = self.first else { return true }
        return allSatisfy { $0 == first }
    }
}
print([1, 1, 1].allEqual())   // true
```

## Step 3. Special kinds of protocols

- **`AnyObject`** — a "classes only" constraint protocol: `protocol Observer: AnyObject { }`. A struct can't adopt it. It is needed to be able to write `weak var delegate: Observer?`.
- **`@objc optional`** — optional requirements, only for `@objc` protocols and classes: `@objc protocol P { @objc optional func f() }`. In pure Swift, "optionality" is achieved through a default implementation in an `extension`.
- A protocol as a type: `let items: [Drawable]` — an existential type ([tutorial 08](../generics-any-some/)).

## Step 4. Delegate — the most common use

```swift
protocol ButtonDelegate: AnyObject {      // AnyObject is needed for weak
    func didTapButton()
}

final class Button {
    weak var delegate: ButtonDelegate?     // weak: no retain cycle
    func tap() { delegate?.didTapButton() }
}

final class ViewController: ButtonDelegate {
    let button = Button()
    init() { button.delegate = self }      // the screen holds the button, the button holds the screen weakly
    func didTapButton() { print("Button was tapped") }
}

let vc = ViewController()
vc.button.tap()   // Button was tapped
```

Protocols also make testing easier: instead of a concrete service you plug in a stub (mock).

## Step 5. Extension

> **Extension** adds new behavior to an existing type without inheritance and without access to its source code.

**You can add:**

- computed properties (instance and type);
- methods (instance and type);
- new initializers (for classes — `convenience` only);
- subscripts, nested types;
- protocol conformance.

**You can't add:**

- **stored properties** to an instance (the size of the type would change);
- **override** an existing implementation of a method of the same type (an extension only adds);
- add a designated initializer or `deinit` to a class.

```swift
extension Int {
    var isEven: Bool { self % 2 == 0 }
    func squared() -> Int { self * self }
}
print(4.isEven, 5.squared())   // true 25

extension Array {
    subscript(safe index: Index) -> Element? {      // a safe index (tutorial 10)
        indices.contains(index) ? self[index] : nil
    }
}
```

Conventions:

- extensions of your own type are written below the main declaration in the same file (one extension per protocol);
- extensions of other people's types go in separate files like `UIColor+Extensions.swift`.

**Conditional conformance.** A type can conform to a protocol only under a condition — that is why `[Int]` is comparable with `==`, while an array of non-comparable elements is not:

```swift
protocol Describable { func describe() -> String }

extension Int: Describable {
    func describe() -> String { "int \(self)" }
}

// an array is Describable only if its elements are Describable
extension Array: Describable where Element: Describable {
    func describe() -> String { map { $0.describe() }.joined(separator: ", ") }
}

print([1, 2].describe())   // int 1, int 2
```

**Retroactive conformance.** If you make someone else's type conform to someone else's protocol, then starting with Swift 5.10 the compiler suggests marking it `@retroactive` — otherwise the compiler warns: if the owner of the type or protocol later adds the same conformance, a conflict will arise (SE-0364).

## Step 6. Type casting

> **Type casting** — checking an instance's type at runtime and moving to another type from the same hierarchy, or to a protocol.

| Operator | Purpose | On failure |
| --- | --- | --- |
| `is` | checks the type, returns `Bool` | `false` |
| `as` | a safe cast (upcast, bridging, literals) | compile error |
| `as?` | an attempted downcast | `nil` |
| `as!` | a forced downcast | crash |

```swift
class Animal { }
class Dog: Animal { func bark() { print("woof") } }
class Cat: Animal { }

let pets: [Animal] = [Dog(), Cat(), Dog()]

for pet in pets {
    if let dog = pet as? Dog {     // optional binding + downcast
        dog.bark()
    }
}
print(pets[1] is Cat)              // true
let animal = Dog() as Animal       // an upcast is always safe

let mixed: [Any] = [1, "hi", true, 3.5]
for item in mixed {
    switch item {
    case let n as Int: print("Int \(n)")
    case let s as String: print("String \(s)")
    default: print("other")
    }
}
```

- **`Any`** — a type that can hold a value of any type, including functions; **`AnyObject`** — an instance of any class. It is better to avoid them: they lose static typing ([tutorial 08](../generics-any-some/)).
- `as?` most often appears together with optional binding. Another example is handling a JSON dictionary `[String: Any]` ([tutorial 04](../optional/)).

## Step 7. Advanced operators

**Bitwise:** `~` (NOT), `&` (AND), `|` (OR), `^` (XOR), `<<` and `>>` (shifts).

```swift
let a: UInt8 = 0b1100
let b: UInt8 = 0b1010
print(a & b)    // 8  (0b1000)
print(a | b)    // 14 (0b1110)
print(a ^ b)    // 6  (0b0110)
print(~a)       // 243 (all 8 bits inverted)
print(a << 1)   // 24
```

**Overflow operators** `&+`, `&-`, `&*` — no crash, with "wrap-around". The ordinary `+` crashes at runtime on overflow:

```swift
let big = UInt8.max
// let boom = big + 1          // crash: arithmetic overflow
let wrapped = big &+ 1         // 0
let (value, overflow) = big.addingReportingOverflow(1)   // (0, true)
```

**Identity operators** `===` and `!==` — check whether two references point to the same object (classes only, [tutorial 01](../structs-classes-enums/)).

**Custom operators** with precedence and associativity:

```swift
precedencegroup ExponentiationPrecedence {
    higherThan: MultiplicationPrecedence
    associativity: right
}
infix operator ** : ExponentiationPrecedence

func ** (base: Int, power: Int) -> Int {
    (0..<power).reduce(1) { acc, _ in acc * base }
}

print(2 ** 3 ** 2)   // 512: right associativity → 2 ** (3 ** 2) = 2 ** 9
```

Compound assignment operators (`+=`, `-=`, `*=`, etc.) combine an operation and an assignment; for your own operators they have to be declared separately, with an `inout` left argument.

## Common mistakes

- A delegate without `weak` → a retain cycle; without `AnyObject` in the protocol — a compile error.
- Adding a method to a protocol `extension` without putting it in the requirements and expecting polymorphism.
- Trying to add a stored property in an `extension`.
- Thinking that a protocol requires a computed property — it requires access.
- `as!` instead of `as?` without certainty → a crash.
- Storing data in `[Any]` instead of an enum with associated values.
- Using `%` on floating-point numbers — it won't compile.

<details>
<summary>A tricky question: what does this code print?</summary>

```swift
protocol P { }
extension P { func method() { print("from protocol") } }
struct C: P { func method() { print("from struct") } }

let first = C()
first.method()
let second: P = C()
second.method()
```

Answer: `from struct` and `from protocol`. `method` is not part of `P`'s requirements, so the implementation is chosen by the variable's static type: `C` in the first case, `P` in the second. If you add `func method()` to the protocol itself, the second output becomes `from struct`.

</details>

## Cheat sheet

```swift
protocol P: AnyObject, Q { var x: Int { get set }; func f(); static func g(); init() }
extension P { func f() { } }                    // default implementation
extension Collection where Element: Equatable { }
func h(_ v: P & Q) { }                          // composition
weak var delegate: P?                            // only for AnyObject protocols

x is T;  x as T;  x as? T;  x as! T

&+ &- &*;  ~ & | ^ << >>
infix operator ** : ExponentiationPrecedence
```

## Self-check questions

<details>
<summary>1. What can a protocol require?</summary>

Properties (with the access specified as `get`/`get set`), methods (including `mutating` and `static`), initializers, subscripts, associated types.

</details>

<details>
<summary>2. Why is a delegate made weak and what does the protocol need for that?</summary>

To avoid a retain cycle: the owner holds the object, and the object holds the delegate. The protocol must be marked `: AnyObject`.

</details>

<details>
<summary>3. What can't you do in an extension?</summary>

Add stored properties, override an already existing implementation of the same type, add a designated initializer or `deinit` to a class.

</details>

<details>
<summary>4. How does as? differ from as!?</summary>

`as?` returns an Optional and `nil` on failure, `as!` crashes the app on failure.

</details>

<details>
<summary>5. How do overflow operators differ from ordinary ones?</summary>

`&+` and the others "wrap around" the result on overflow, while the ordinary `+`, `-`, `*` crash on overflow.

</details>

<details>
<summary>6. How do you define your own operator?</summary>

Declare `infix operator ** : SomePrecedenceGroup` and implement a function with that name. Precedence and associativity are set in a `precedencegroup`.

</details>

## Sources

- [Protocols — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [Extensions — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
- [Type Casting — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting/)
- [Advanced Operators — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [SE-0364: Warning for Retroactive Conformances of External Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0364-retroactive-conformance-warning.md)
