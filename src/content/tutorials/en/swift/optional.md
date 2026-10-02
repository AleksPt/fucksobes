---
title: "Optional"
order: 4
---

> **What you'll learn**
>
> - What Optional is under the hood and how it is implemented
> - All the ways to unwrap and when to choose which
> - Optional chaining, `??`, `guard let`, the `if let` shorthand
> - How `map` differs from `flatMap` on Optional
> - How to write your own Optional (a classic interview task)
> - What `ExpressibleByNilLiteral` and implicitly unwrapped optionals are

> **Prerequisites:** [tutorial 01](../structs-classes-enums/) (enum, associated values), the basics of generics (covered in detail in [tutorial 08](../generics-any-some/)).

## Analogy: a surprise box

Optional is a box that either **has something in it** or **has nothing**.

- **Unwrapping** — opening the box. Forced (`!`) — tearing it open without looking: if it's empty, there will be a scandal (a crash).
- **Optional binding** — look first, and if there is something, move it to a safe place.
- **`??`** — if the box is empty, take a spare gift.
- **Optional chaining** — a chain of boxes: if even one is empty, the whole chain gives "empty".

## Step 1. Optional is an enum

> **Optional** — an ordinary generic enum of the standard library with two cases: `.none` (no value, the same as `nil`) and `.some(Wrapped)` (there is a value).

```swift
enum Optional<Wrapped> {
    case none
    case some(Wrapped)
}

let a: Int? = 42          // short form
let b: Optional<Int> = .some(42)   // full form
let c: Int? = nil         // the same as .none
```

Advantages:

- the absence of a value is checked **at compile time**: you can't forget to handle `nil`;
- at runtime Swift almost never crashes with a "null pointer": the only way is force-unwrapping `nil`;
- an Optional variable without a value automatically equals `nil`.

The process of turning `T?` into `T` is called **unwrapping**, not casting — this emphasizes that Optional is a container.

## Step 2. Ways to unwrap

```swift
let name: String? = "Swift"
```

| Way | Example | When |
| --- | --- | --- |
| Force unwrap | `name!` | only if `nil` is a programmer's bug; crashes on `nil` |
| Optional binding | `if let n = name { }` | you need an action only if the value is present |
| `guard let` | `guard let n = name else { return }` | early exit, the value is needed until the end of the scope |
| Nil-coalescing | `name ?? "unknown"` | there is a reasonable default value |
| Optional chaining | `user?.address?.city` | a chain of property and method accesses |
| `map` / `flatMap` | `name.map { $0.count }` | transform the value inside without unwrapping it |
| Implicitly unwrapped | `var x: String!` | the value is guaranteed to appear before first use |

```swift
if let n = name {
    print("Hello, \(n)")
}

func greet(_ name: String?) {
    guard let n = name else { return }   // from here n is an ordinary String
    print("Hello, \(n)")
}

let count = name?.count ?? 0            // Int, not Int?
```

**The `if let x` shorthand (Swift 5.7, SE-0345).** If the variable name is the same, you don't have to repeat it:

```swift
let title: String? = "Title"
if let title {            // the same as if let title = title
    print(title)
}
guard let title else { return }
```

## Step 3. guard

> **`guard`** checks a condition and, if it is false, **must exit the current scope** in the `else` branch. Variables declared in `guard let` stay available after it.

```swift
func process(_ data: [String: Any]) {
    guard let id = data["id"] as? Int,
          let name = data["name"] as? String else {
        print("invalid data")
        return
    }
    print(id, name)    // both are available here, with no nesting
}
```

`if let` is more convenient when you need a meaningful `else` block or when a missing value doesn't interrupt the function. `guard` — when the values are needed later and you want to avoid nested `if let`.

## Step 4. Optional chaining

> **Optional chaining** — a chain of accesses to properties, methods and subscripts where each link can be `nil`. Execution goes **left to right** and stops at the first `nil`; the result of the whole chain is an Optional.

```swift
class Person { var residence: Residence? }
class Residence { var numberOfRooms = 1 }

let john = Person()
// let n = john.residence!.numberOfRooms   // crash at runtime
if let rooms = john.residence?.numberOfRooms {
    print("rooms: \(rooms)")
} else {
    print("could not get the value")       // this will be printed
}
```

The difference from nested optionals: `Int??` is two levels, visible from the number of question marks.

```swift
let single: Int? = 5
let double: Int?? = .some(nil)   // the outer one is present, nil inside
print(double == nil)             // false: the outer Optional is not empty
```

## Step 5. Nil-coalescing `??`

```swift
let text: String? = nil
let shown = text ?? "no text"
```

The signature (simplified): `func ?? <T>(optional: T?, defaultValue: @autoclosure () throws -> T) rethrows -> T`. The right-hand value is evaluated **lazily**, only if the left is `nil`. The right-hand side can also be an Optional: then the result is an Optional (`T?`).

## Step 6. map and flatMap on Optional

> **`map`** applies a closure to the value inside, if there is one, and wraps the result back into an Optional. **`flatMap`** is needed when the closure **itself returns an Optional**: it removes the extra level.

```swift
let s: String? = "42"

let viaMap: Int?? = s.map { Int($0) }        // Optional(Optional(42))
let viaFlatMap: Int? = s.flatMap { Int($0) } // Optional(42)

let squared = Int("7").map { $0 * $0 }       // Optional(49)
```

```swift
let name: String? = "twostraws"
print(name.map { "@\($0)" } as Any)   // Optional("@twostraws")
```

<details>
<summary>Why does it work this way?</summary>

`Int($0)` returns `Int?`. `map` wraps it once more: you get `Int??`. `flatMap` "flattens" one level. The same rule applies to `Sequence.flatMap` (it flattens nested sequences), and to remove `nil` from a sequence there is `compactMap` ([tutorial 06](../closures-higher-order/)).

</details>

## Step 7. Implicitly unwrapped optional

```swift
let label: String! = "text"
let copy: String = label     // unwrapped automatically
let maybe = label            // the type is String? — it stays an Optional
```

The type `T!` is an ordinary Optional with a flag "unwrap automatically when a non-Optional is needed". If it turns out to be `nil` in such a use, it crashes. A justified example is `@IBOutlet` in UIKit: the context guarantees that the value will appear before first use. Otherwise a plain Optional or `lazy` is better.

## Step 8. Your own Optional (an interview task)

It tests whether you understand that Optional is just an enum and how its operations work. The minimum is two cases; a good answer includes `map`, `flatMap`, `??` and force unwrapping.

```swift
enum Maybe<Wrapped> {
    case none
    case some(Wrapped)

    func map<U>(_ transform: (Wrapped) throws -> U) rethrows -> Maybe<U> {
        switch self {
        case .some(let v): return .some(try transform(v))
        case .none:        return .none
        }
    }

    func flatMap<U>(_ transform: (Wrapped) throws -> Maybe<U>) rethrows -> Maybe<U> {
        switch self {
        case .some(let v): return try transform(v)   // without an extra wrapper
        case .none:        return .none
        }
    }

    // the analog of ??
    func or(_ defaultValue: @autoclosure () throws -> Wrapped) rethrows -> Wrapped {
        switch self {
        case .some(let v): return v
        case .none:        return try defaultValue()
        }
    }

    // the analog of !
    func unwrapOrCrash() -> Wrapped {
        switch self {
        case .some(let v): return v
        case .none:        fatalError("Unexpectedly found nil")
        }
    }
}

// comparison: conditional conformance is enough
extension Maybe: Equatable where Wrapped: Equatable {}

let value = Maybe.some(2)
print(value.map { $0 * $0 }.or(0))      // 4
print(Maybe<Int>.none.or(10))           // 10
print(Maybe.some(1) == Maybe.some(1))   // true
print(Maybe<Int>.none == Maybe<Int>.none)   // true
```

**`ExpressibleByNilLiteral`** — a protocol with a single requirement, `init(nilLiteral: ())`. Thanks to it, an `Optional` is created from the `nil` literal. Implementing it for your own types is not recommended: it exists specifically for Optional.

**How Optionals are compared.** `Optional<Wrapped>` conforms to `Equatable` and `Hashable` when `Wrapped` does. That is why `Int? == Int?` works, and `nil == nil` is `true`.

## Common mistakes

- Force-unwrapping with `!` "just in case" is the main source of crashes.
- `try!`, `as!`, `!` instead of `guard let` / `??`.
- Mixing up `T??` and `T?` because of `map` instead of `flatMap`.
- Using `T!` for ordinary properties instead of an Optional or a default value.
- Thinking that the chain `a?.b?.c` is read right to left.
- Writing `if x != nil { x! }` instead of `if let`.
- Forgetting that `guard` must exit the scope.

<details>
<summary>A tricky question: what does this code print?</summary>

```swift
let x: Int?? = nil
let y: Int?? = .some(nil)
print(x == nil, y == nil)
```

Answer: `true false`. In `x` the outer Optional is empty; in `y` the outer one contains an inner `nil`.

</details>

## Cheat sheet

```swift
let x: Int? = 5
x!                    // crash on nil
if let v = x { }      // optional binding;  if let x { } is the shorthand
guard let v = x else { return }
x ?? 0                // default value
user?.address?.city   // chaining, left to right
x.map { $0 + 1 }      // Int?
x.flatMap { Int("\($0)") }   // removes the extra level
var z: Int! = 1       // implicitly unwrapped (IBOutlet)
```

## Self-check questions

<details>
<summary>1. How is Optional built under the hood?</summary>

An ordinary generic enum `Optional<Wrapped>` with the cases `.none` and `.some(Wrapped)`. The `nil` literal is created through `ExpressibleByNilLiteral`.

</details>

<details>
<summary>2. Which ways of unwrapping do you know?</summary>

`!`, `if let`, `guard let`, `??`, optional chaining, `map`/`flatMap`, implicitly unwrapped optional.

</details>

<details>
<summary>3. When is force unwrap appropriate?</summary>

When `nil` is a programmer error that must be detected as early as possible (for example, a constant from the bundle). In all other cases, use the safe ways.

</details>

<details>
<summary>4. How does map differ from flatMap on Optional?</summary>

`map` wraps the closure's result in an Optional once more, `flatMap` removes one level if the closure returns an Optional.

</details>

<details>
<summary>5. What is optional chaining?</summary>

A chain of accesses from left to right that is interrupted at the first `nil`. The result is an Optional.

</details>

<details>
<summary>6. How does guard differ from if let?</summary>

`guard` requires leaving the scope in `else`, and the unwrapped value is available until the end of the scope. `if let` confines the scope to the block.

</details>

<details>
<summary>7. How do you implement your own Optional and comparison?</summary>

An enum with `.none` / `.some`, the methods `map`, `flatMap`, analogs of `??` and `!`; comparison through conditional conformance to `Equatable`, with empty values being equal.

</details>

## Sources

- [Optional Chaining — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/optionalchaining/)
- [The Basics (Optionals) — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/)
- [Optional — Apple Developer Documentation](https://developer.apple.com/documentation/swift/optional)
- [SE-0345: if let shorthand](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0345-if-let-shorthand.md)
