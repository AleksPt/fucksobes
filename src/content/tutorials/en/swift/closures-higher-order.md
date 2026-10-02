---
title: "Closures and higher-order functions"
order: 6
---

> **What you'll learn**
>
> - What a closure is and how it differs from a function
> - Shorthand syntax: `$0`, trailing closure, an operator as a closure
> - Value capture and the capture list: `[weak self]`, `[unowned self]`
> - `@escaping` and non-escaping: what this means for the compiler
> - `@autoclosure`
> - `map`, `filter`, `reduce`, `compactMap`, `flatMap`, `sorted` and others
> - How to write your own `map`

> **Prerequisites:** [tutorial 01](../structs-classes-enums/) (reference types, `deinit`), [tutorial 04](../optional/) (Optional).

## Analogy: a "what to do" note you carry with you

You leave a colleague a note: "when the client arrives, show them report No. 5 and mention the discount".

- **Closure** — the note itself: it contains an instruction and **pointers to things** (report No. 5, the discount) that it has "captured".
- **Non-escaping** — the colleague reads the note right now and throws it away.
- **Escaping** — the colleague puts the note in a pocket and reads it later; the note has to outlive the conversation.
- **Retain cycle** — the note lies in the desk, and the desk holds the note in a drawer that this desk needs: nobody will throw away either the desk or the note.

## Step 1. What a closure is

> **Closure** — a self-contained block of code that can be passed around and called, and that can **capture** and store references to constants and variables from the surrounding context.

All forms of closures are reference types: if you assign a closure to two variables, they will refer to the same closure.

Three forms:

1. **Global functions** — have a name, capture nothing.
2. **Nested functions** — have a name, can capture values of the outer function.
3. **Closure expressions** — nameless, can capture.

```swift
func makeIncrementer(incrementAmount: Int) -> () -> Int {
    var total = 0
    func incrementer() -> Int {      // the nested function captures total and incrementAmount
        total += incrementAmount
        return total
    }
    return incrementer
}

let byTwo = makeIncrementer(incrementAmount: 2)
print(byTwo())   // 2
print(byTwo())   // 4 — total lives on even after makeIncrementer returns
```

## Step 2. Syntax and shorthands

The same `sorted(by:)` call in five forms:

```swift
var presidents = ["Washington", "Truman", "Kennedy", "Reagan"]

let a = presidents.sorted(by: { (p1: String, p2: String) -> Bool in return p1 < p2 })
let b = presidents.sorted(by: { p1, p2 in return p1 < p2 })   // types are inferred
let c = presidents.sorted(by: { p1, p2 in p1 < p2 })          // a single expression — return can be omitted
let d = presidents.sorted { $0 < $1 }                         // $0, $1 + trailing closure
let e = presidents.sorted(by: <)                              // an operator as a function
```

- **Trailing closure** — a closure written after the call's parentheses, if it is the last argument.
- `$0`, `$1` — anonymous parameter names; `in` is then not needed.
- Closure parameters are constants. To mutate, create a local `var`: `var number = number`.

```swift
let shifted = [1, 2, 3].map { (number) -> Int in
    var number = number    // the parameter is immutable, so we make a copy
    number += 10
    return number
}
print(shifted)   // [11, 12, 13]
```

## Step 3. Value capture and the capture list

A closure captures variables **by reference**: it sees their latest values and can change them, even if the scope of the declaration has already ended. A **capture list** in square brackets before `in` changes this: it captures **a copy of the value** at the moment the closure is created.

```swift
var counter = 1

let byReference = { print(counter) }           // capture by reference
let byValue = { [captured = counter] in print(captured) }   // a copy at creation time

counter += 1
byReference()   // 2
byValue()       // 1
```

## Step 4. @escaping and non-escaping

> **Non-escaping** (the default) — the closure can only be called before the function returns; it cannot be stored. **`@escaping`** — the closure may "escape" the function: be stored and called later.

```swift
func runNow(_ work: () -> Void) {            // non-escaping
    work()
}

var stored: [() -> Void] = []
func runLater(_ work: @escaping () -> Void) {   // escaping: we store it
    stored.append(work)
}
```

What this gives the compiler:

- a non-escaping closure doesn't need to be kept on the heap and reference-counted — it won't outlive the function call (an optimization);
- in a non-escaping closure you can access `self` without writing `self.`;
- in an `@escaping` closure for a class, `self` must be written explicitly (or included in the capture list), so that you are aware of the capture;
- an `@escaping` closure **cannot capture an `inout` parameter or a struct's `mutating self`**.

```swift
func doNow(_ closure: () -> Void) { closure() }
func doLater(_ closure: @escaping () -> Void) { closure() }

struct Box {
    var first = 0
    var second = ""
    mutating func update() {
        doNow { first = 10 }              // ok
        // doLater { self.second = "Hi" } // error: escaping closure captures mutating 'self' parameter
    }
}

class Holder {
    var first = 0
    var second = ""
    func update() {
        doNow { first = 11 }
        doLater { self.second = "Hello" }   // works for a class, self is explicit
    }
}
```

## Step 5. Retain cycles and [weak self]

A class stores an `@escaping` closure, and the closure captures a strong reference to that class — a cycle `self → closure → self`. `deinit` will not be called.

```swift
final class ViewModel {
    var title = "A"
    var onUpdate: (() -> Void)?

    func bindLeaky() {
        onUpdate = { print(self.title) }          // cycle → leak
    }

    func bindSafe() {
        onUpdate = { [weak self] in
            guard let self else { return }       // self may be nil
            print(self.title)
        }
    }
    deinit { print("deinit") }
}

var vm: ViewModel? = ViewModel()
vm?.bindSafe()
vm = nil                  // deinit will fire
```

| Capture | What it does | When |
| --- | --- | --- |
| strong (the default) | keeps the object alive | the closure's lifetime is shorter than the object's or it isn't stored in that object |
| `[weak self]` | a weak reference, becomes `nil` after deallocation | the object may disappear before the closure does |
| `[unowned self]` | no reference counting, not an Optional; accessing a deallocated object crashes | the object is guaranteed to live at least as long as the closure |

Since Swift 5.3 (SE-0269) in an `@escaping` closure you can omit `self.` if `self` is in the capture list (`[self]`) or if `self` is a value type. Since Swift 5.8 (SE-0365) this also works after `[weak self]` + `guard let self`.

> GCD closures (`DispatchQueue.async`) do not create a retain cycle: the queue holds the closure only until it runs, and the object does not store the queue-closure pair. `[weak self]` is needed there only if you don't want to extend the object's lifetime (tutorial «GCD» in the «Concurrency» topic).

## Step 6. @autoclosure

> **`@autoclosure`** automatically wraps the passed expression in a closure with no parameters. The expression is evaluated **lazily**, only when the closure is called.

```swift
func logIfDebug(_ isDebug: Bool, _ message: @autoclosure () -> String) {
    if isDebug { print(message()) }
}

func expensiveDescription() -> String {
    print("computing")
    return "debug"
}

logIfDebug(false, expensiveDescription())   // prints nothing: the expression was not evaluated
logIfDebug(true, expensiveDescription())    // computing → debug
```

This is how `&&`, `||`, `??`, `assert` work. It combines with `@escaping`: `@autoclosure @escaping () -> T`.

## Step 7. Higher-order functions

> **Higher-order function** — a function that takes other functions (closures) or returns them.

```swift
let nums = [1, 2, 3, 4, 5, 6]

let doubled = nums.map { $0 * 2 }                  // [2, 4, 6, 8, 10, 12]
let evens = nums.filter { $0 % 2 == 0 }            // [2, 4, 6]
let sum = nums.reduce(0, +)                         // 21
let product = nums.reduce(1) { $0 * $1 }            // 720

let strings = ["1", "x", "3"]
let ints = strings.compactMap { Int($0) }           // [1, 3] — nils are dropped

let names = ["Tim", "Ann"]
let letters = names.flatMap { $0 }                  // ["T", "i", "m", "A", "n", "n"] — flattens by one level

let allEven = nums.allSatisfy { $0 % 2 == 0 }       // false
let hasBig = nums.contains { $0 > 5 }               // true
let firstBig = nums.first { $0 > 3 }                // Optional(4)
```

| Method | What it does |
| --- | --- |
| `map` | transforms each element, returns an array of the same length |
| `compactMap` | transforms and drops `nil` |
| `flatMap` | transforms into a sequence and flattens by one level |
| `filter` | keeps the elements that satisfy the condition |
| `reduce` | folds a sequence into a single value |
| `sorted(by:)` | returns a new sorted array (`sort(by:)` sorts in place) |
| `forEach` | performs an action for each element; `break`/`continue` don't work inside |

```swift
var a = ["🔥", "💧", "☀️", "❄️", "🔥"]

a.swapAt(0, 3)
print(a)                       // ["❄️", "💧", "☀️", "🔥", "🔥"]

let slice = a.dropFirst(2)     // ArraySlice: ["☀️", "🔥", "🔥"]
let last2 = a.suffix(2)        // ["🔥", "🔥"]
let first = a.removeFirst()    // "❄️", the array is now ["💧", "☀️", "🔥", "🔥"]
```

**Write your own `map`** — a common interview task:

```swift
extension Sequence {
    func myMap<T>(_ transform: (Element) throws -> T) rethrows -> [T] {
        var result: [T] = []
        for item in self {
            result.append(try transform(item))
        }
        return result
    }
}

print([1, 2, 3].myMap { $0 * $0 })   // [1, 4, 9]
```

**`@Sendable`.** A closure that is passed between threads/actors (`Task`, `DispatchQueue`) is marked `@Sendable`: the compiler forbids capturing mutable shared data without protection (tutorial «Swift Concurrency» in the «Concurrency» topic).

## Common mistakes

- A strong capture of `self` in an `@escaping` closure that is stored in `self` itself → a retain cycle.
- `[unowned self]` when the object may outlive the call → a crash.
- Trying to capture `mutating self` in an `@escaping` closure.
- Expecting a copy of the value without a capture list: it will be a capture by reference.
- Hoping that `forEach` supports `break`/`continue`/`return` from the outer function.
- Mixing up `map` and `flatMap`/`compactMap` for an array of optionals.

<details>
<summary>A tricky question: what does this code print?</summary>

```swift
var x = 10
let f = { [x] in print(x) }
x = 20
f()
```

Answer: `10`. The capture list `[x]` captured a copy of the value at the moment the closure was created. Without `[x]` it would be `20`.

</details>

## Cheat sheet

```swift
{ (a: Int, b: Int) -> Int in a + b }     // full form
{ $0 + $1 }                              // shorthand
items.sorted(by: <)                      // an operator as a closure

{ [weak self] in guard let self else { return }; ... }
{ [captured = value] in ... }            // a copy at creation time

func f(_ c: () -> Void) { }              // non-escaping (the default)
func g(_ c: @escaping () -> Void) { }    // stored / called later
func h(_ v: @autoclosure () -> Int) { }  // a lazy expression

map / compactMap / flatMap / filter / reduce / sorted / allSatisfy / contains(where:)
```

## Self-check questions

<details>
<summary>1. What is a closure and why is it a reference type?</summary>

A block of code with captured values. Its context lives on the heap and is shared between copies of the reference, so assigning a closure copies the reference.

</details>

<details>
<summary>2. How does escaping differ from non-escaping?</summary>

A non-escaping closure is called only before the function returns and is not stored; an escaping one can be stored and called later, so it requires an explicit `self` and a thought-out capture.

</details>

<details>
<summary>3. How does a retain cycle arise in closures and how do you avoid it?</summary>

The object holds the closure, the closure holds the object. Break it with `[weak self]` (or `[unowned self]` if the lifetime is guaranteed).

</details>

<details>
<summary>4. What is @autoclosure?</summary>

A parameter attribute that wraps the passed expression in a closure; it is evaluated lazily (`&&`, `??`, `assert`).

</details>

<details>
<summary>5. How do map, flatMap and compactMap differ?</summary>

`map` — a 1→1 transformation; `compactMap` — a transformation that drops `nil`; `flatMap` — a transformation into a sequence and flattening.

</details>

<details>
<summary>6. What is a higher-order function?</summary>

A function that takes a function or returns a function.

</details>

## Sources

- [Closures — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
- [Automatic Reference Counting — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [SE-0269: Implicit self in escaping closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0269-implicit-self-weak-capture.md)
- [SE-0365: Allow implicit self for weak self captures after self is unwrapped](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0365-implicit-self-weak-capture.md)
- [Sequence — Apple Developer Documentation](https://developer.apple.com/documentation/swift/sequence)
