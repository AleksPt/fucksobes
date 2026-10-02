---
title: "Properties and property wrappers"
order: 2
---

> **What you'll learn**
>
> - What kinds of properties there are: stored, computed, lazy, type (`static`/`class`)
> - How `willSet`/`didSet` work and when they are not called
> - How `static` differs from `class`
> - What is actually thread-safe about `static` and `lazy`
> - How property wrappers work: `wrappedValue`, `projectedValue`, the `$` syntax

> **Prerequisites:** [tutorial 01](../structs-classes-enums/) — struct, class, `mutating`.

## Analogy: household appliances

- **Stored property** — a shelf in a closet: the item just sits there.
- **Computed** — the display on a microwave: the time itself isn't stored there, it is calculated from the state.
- **Lazy** — a kettle that you put on the stove only when you actually want tea.
- **Observer** — a sensor on a door: it triggers every time the door is opened.
- **Property wrapper** — a cover for an item: anything put into the cover gets the cover's rules (for example, "no higher than 20").

## Step 1. Stored and computed properties

> **Stored property** — a variable or constant that lives inside an instance. **Computed property** — does not store a value, but calculates it in `get` and, if desired, updates state in `set`.

```swift
struct Rectangle {
    var width: Double
    var height: Double

    var area: Double {                 // computed
        get { width * height }
        set { height = newValue / width }
    }
    var perimeter: Double { 2 * (width + height) }   // read-only, get can be omitted
}

var r = Rectangle(width: 10, height: 5)
print(r.area)        // 50.0
r.area = 100
print(r.height)      // 10.0
```

- A computed property must have an explicit type and the `var` keyword.
- Computed properties are allowed in struct, class and enum. An enum has no stored instance fields ([tutorial 01](../structs-classes-enums/)).

## Step 2. Property observers

> **`willSet`** is called before the write (it receives `newValue`), **`didSet`** — after it (it receives `oldValue`).

```swift
class StepCounter {
    var totalSteps = 0 {
        willSet { print("will be \(newValue)") }
        didSet  { print("added \(totalSteps - oldValue)") }
    }
}
let counter = StepCounter()
counter.totalSteps = 200
// will be 200
// added 200
```

Rules:

- observers are **not called** when the initial value is set and inside the class's own `init`;
- for an inherited property they are called from the subclass's `init` too — after the `super.init` call;
- observers can be attached to any stored property (except `lazy`) or to an inherited property in a subclass; not to a `let`: it has no write.

## Step 3. Lazy properties

> **`lazy var`** — a stored property whose initial value is computed on **first access**, not at initialization.

```swift
class DataImporter { var filename = "data.txt"; init() { print("heavy initialization") } }

class DataManager {
    lazy var importer = DataImporter()
    var data: [String] = []
}

let manager = DataManager()          // importer is not created yet
print(manager.importer.filename)     // heavy initialization → data.txt
```

- Always `var`, never `let`: the value appears after `init` has finished.
- Useful when the value is expensive or depends on state that is unknown during initialization. Inside the initializer closure you can refer to `self`.
- **It doesn't always save memory:** once created, the value stays alive, and the "has it been created" check is performed on every access.

> `lazy` is **not thread-safe**: if several threads access a not-yet-initialized property at the same time, there is no guarantee that initialization runs only once. Synchronization is needed (tutorial «Thread safety» in the concurrency topic).

## Step 4. Type properties: static and class

A type property belongs to the type itself, not to an instance. It is declared with `static`, and in classes also with `class` (computed only).

```swift
class Shape {
    static let sides = 0                     // cannot be overridden
    class var name: String { "shape" }       // can be overridden in a subclass
    class func make() -> Shape { Shape() }
}
class Circle: Shape {
    override class var name: String { "circle" }
}
print(Circle.name)   // circle
```

- `static` is `class final`: it cannot be overridden.
- `class` is allowed only for computed properties and methods. A stored type property can only be `static`.
- Stored type properties are lazy: they are initialized on first access.

**(supplemented)** **Swift 6.** In the Swift 6 language mode, a mutable global or `static var` variable without isolation is a compile error (strict concurrency, SE-0412). Ways to fix it: make it `let`, isolate it with `@MainActor`, wrap it in an actor, or explicitly mark it `nonisolated(unsafe)` if you provide the synchronization yourself.

```swift
struct AppConfig {
    static let apiURL = "https://api.example.com"   // ok: immutable, initialized once

    @MainActor static var isDebug = false           // ok: accessible only from the main actor
}
```

Why a singleton is often written like this: `static let shared = Service()` — a single instance, created lazily and exactly once.

## Step 5. Property wrappers

> **Property wrapper** — a type marked `@propertyWrapper` that encapsulates the logic of reading and writing a property and lets you reuse it with an attribute (`@Wrapper var x`).

The mandatory requirement is the **`wrappedValue`** property. The compiler turns `@Capitalized var name: String` into a hidden stored property `_name` of type `Capitalized` and a computed `name` that goes through `wrappedValue`.

```swift
import Foundation

@propertyWrapper
struct Capitalized {
    private var value = ""
    var wrappedValue: String {
        get { value }
        set { value = newValue.capitalized }
    }
}

struct Person {
    @Capitalized var name: String
}

var p = Person()
p.name = "john doe"
print(p.name)   // John Doe
```

**An example with a constraint (before and after).** You need a rectangle whose height is no more than 20:

```swift
// before: the logic is baked into a single struct
struct SmallRectangle {
    private var _height = 0
    var height: Int {
        get { _height }
        set { _height = min(newValue, 20) }
    }
}

// after: the logic is reusable
@propertyWrapper
struct TwentyOrLess {
    private var number = 0
    var wrappedValue: Int {
        get { number }
        set { number = min(newValue, 20) }
    }
}

struct Rect2 {
    @TwentyOrLess var height: Int
    @TwentyOrLess var width: Int
}
```

```swift
import Foundation

@propertyWrapper
struct UserDefault<Value> {
    let key: String
    let defaultValue: Value
    var storage: UserDefaults = .standard

    var wrappedValue: Value {
        get { storage.object(forKey: key) as? Value ?? defaultValue }
        nonmutating set { storage.set(newValue, forKey: key) }
    }
}

struct Settings {
    @UserDefault(key: "mark-as-read", defaultValue: false)
    var autoMarkAsRead: Bool
}

let settings = Settings()
settings.autoMarkAsRead = true
print(settings.autoMarkAsRead)   // true
```

**`projectedValue` and `$`.** A wrapper can expose an additional interface through `projectedValue`; it is available with the `$` prefix:

```swift
@propertyWrapper
struct Clamped {
    private var value: Int
    let range: ClosedRange<Int>
    private(set) var projectedValue = false      // "did the value have to be clamped?"

    init(wrappedValue: Int, _ range: ClosedRange<Int>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
        self.projectedValue = self.value != wrappedValue
    }

    var wrappedValue: Int {
        get { value }
        set {
            value = min(max(newValue, range.lowerBound), range.upperBound)
            projectedValue = value != newValue
        }
    }
}

struct Volume { @Clamped(0...100) var level: Int = 50 }

var v = Volume()
v.level = 150
print(v.level, v.$level)   // 100 true
```

<details>
<summary>Why does it work this way?</summary>

`v.level` goes through `wrappedValue`, while `v.$level` is the wrapper's `projectedValue`. SwiftUI is built on the same mechanism: `@State var count` gives the value, and `$count` gives a `Binding`.

</details>

> The list of built-in SwiftUI wrappers (`@State`, `@Binding`, `@Environment`, etc.) is covered in the «SwiftUI» topic.

## Common mistakes

- Expecting `willSet`/`didSet` to fire in the class's own `init` or when a default value is set.
- Declaring `lazy let` — it won't compile, you need `var`.
- Assuming `lazy` is thread-safe or always saves memory.
- Using `static var` as a "thread-safe" global counter.
- Trying to declare a stored `class var` — only a computed one is allowed.
- Forgetting that a wrapper is stored as a hidden `_name` field (it increases the size of the struct).

<details>
<summary>A tricky question: why is a singleton made with static?</summary>

The lazy initialization of a stored `static` property is guaranteed to happen exactly once, even when threads race. But if the singleton has mutable state, it still has to be protected separately.

</details>

## Cheat sheet

```swift
var a: Int { get { 1 } set { /* newValue */ } }   // computed
var b = 0 { willSet { } didSet { /* oldValue */ } }
lazy var c = HeavyThing()          // var only, not thread-safe
static let shared = Service()      // lazy one-time initialization
class var overridable: String { "x" }   // class — computed only

@propertyWrapper struct W {
    var wrappedValue: Int           // required
    var projectedValue: Bool { true }   // optional, available as $x
}
```

## Self-check questions

<details>
<summary>1. How does static differ from class?</summary>

`static` cannot be overridden in subclasses (it is `class final`); `class` can, but only for methods and computed properties.

</details>

<details>
<summary>2. When are willSet and didSet not called?</summary>

When the initial value is set and inside the class's own `init`. For inherited properties they are called from the subclass's `init` after `super.init`.

</details>

<details>
<summary>3. What is a lazy property, and does it always save memory?</summary>

A property whose value is computed on first access. Not always: after it is computed the value stays, and the check is performed on every access.

</details>

<details>
<summary>4. Are lazy and static thread-safe?</summary>

`lazy var` is not. A stored `static` property is thread-safe only as far as one-time initialization goes, but not for changing the value.

</details>

<details>
<summary>5. How does a property wrapper work under the hood?</summary>

The compiler creates a hidden `_name` field of the wrapper's type and a computed `name` that accesses `wrappedValue`. `projectedValue` is available as `$name`.

</details>

<details>
<summary>6. How does a computed property differ from a method?</summary>

Syntactically, by the absence of call parentheses; semantically, it is "a value, not an action". For expensive operations or ones with side effects a method is better.

</details>

## Sources

- [Properties — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [Attributes (propertyWrapper) — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
- [SE-0258: Property Wrappers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md)
- [SE-0412: Strict concurrency for global variables](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0412-strict-concurrency-for-global-variables.md)
