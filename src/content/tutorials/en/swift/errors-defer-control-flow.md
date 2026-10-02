---
title: "Errors, defer and control flow"
order: 5
---

> **What you'll learn**
>
> - How error handling works: `Error`, `throw`, `throws`, `do-catch`
> - How `try`, `try?` and `try!` differ from each other
> - What `rethrows`, `Result` and typed throws (Swift 6) are
> - How `defer` works and in what order it runs
> - Control transfer statements: `break`, `continue`, `fallthrough`, `return`, `throw`

> **Prerequisites:** [tutorial 01](../structs-classes-enums/) (enum), [tutorial 04](../optional/) (Optional, `guard`).

## Analogy: mail with "not delivered"

- **`throw`** — the courier returned the parcel with a reason for the failure.
- **`do-catch`** — you are at the pickup desk: if a "not delivered" notice arrives, you work out the reason and decide what to do.
- **`try?`** — "if it didn't arrive, we assume there is no parcel".
- **`try!`** — "100% sure it will arrive". If it doesn't, the program crashes.
- **`defer`** — a note "clean the desk before leaving": it runs however you leave.

## Step 1. Error and throw

> **`Error`** — an empty marker protocol. Any type that conforms to it can be thrown as an error. Usually it is an `enum`.

```swift
import Foundation

enum NetworkError: Error {
    case badURL
    case requestFailed(statusCode: Int)
    case unknown
}

func fetchData(from urlString: String) throws -> String {
    guard URL(string: urlString) != nil else {
        throw NetworkError.badURL
    }
    let statusCode = 503                    // simulating a server response
    guard statusCode == 200 else {
        throw NetworkError.requestFailed(statusCode: statusCode)
    }
    return "data"
}
```

- `throws` in the signature says that the function can throw an error; `throw` throws it.
- A call to such a function must be marked with `try`: the compiler makes you show all the points where an exit by error is possible.
- You can throw any type that conforms to `Error`; in a plain `throws` the error type is erased to `any Error`.

## Step 2. do-catch

```swift
do {
    let text = try fetchData(from: "https://example.com")
    print(text)
} catch NetworkError.badURL {
    print("Invalid URL")
} catch NetworkError.requestFailed(let code) where code >= 500 {
    print("Server error: \(code)")    // this will be printed
} catch {
    print("Other error: \(error)")   // the implicit error variable
}
```

- `catch` branches are checked in order; each can use patterns: `catch NetworkError.badURL`, `catch let e as NetworkError`, `catch is NetworkError`, a `where` condition.
- If the calling function is itself `throws`, an unhandled error is simply propagated up without `do-catch`.
- For user-friendly messages an error is usually extended with `LocalizedError`:

```swift
extension NetworkError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .badURL: return "Invalid address"
        case .requestFailed(let code): return "The server responded with code \(code)"
        case .unknown: return "Unknown error"
        }
    }
}
```

## Step 3. try, try? and try!

```swift
let a = try? fetchData(from: "https://example.com")   // String? — the error turned into nil
if a == nil { print("failed") }

// let b = try! fetchData(from: "https://example.com")  // crash at runtime on error
```

| Variant | Result | On error |
| --- | --- | --- |
| `try` • `do-catch` | `T` | jumps to `catch` |
| `try?` | `T?` | `nil`, the reason is lost |
| `try!` | `T` | the app crashes |

Since Swift 5 (SE-0230) `try?` **does not produce a double Optional**: if a function returns `Int?` and `throws`, then `try? f()` has the type `Int?`, not `Int??`.

> `try!` only if the error is impossible by construction (for example, loading a resource from the bundle itself, if its absence is a build bug). For checks, `guard let ... try?` or a proper `do-catch` is better.

## Step 4. rethrows

> **`rethrows`** — a function throws an error only if the closure passed to it throws. For a non-throwing closure it is an ordinary call without `try`.

```swift
func performTwice(_ operation: () throws -> Void) rethrows {
    try operation()
    try operation()
}

performTwice { print("hi") }                 // no try needed, the closure doesn't throw

do {
    try performTwice { throw NetworkError.unknown }   // here try is mandatory
} catch {
    print("caught: \(error)")
}
```

This is how `map`, `filter`, `sorted(by:)` and others work: if the closure doesn't throw, `try` is not needed.

## Step 5. defer

> **`defer`** runs a block of code **when leaving the current scope** — no matter how exactly we leave: `return`, `throw`, `break` or simply the end of the block. Several `defer`s in one scope run in **reverse order** (LIFO).

```swift
func funWithDefers(_ flag: Bool) {
    defer { print("defer 1") }
    if flag {
        defer { print("defer 2") }
        defer { print("defer 3") }
        print("inside if")
    }
    print("after if")
}

funWithDefers(true)
// inside if
// defer 3
// defer 2
// after if
// defer 1
```

**What defer is for:** paired operations — open/close a file, `lock`/`unlock`, `enter`/`leave`, begin/end a transaction. The cleanup won't be forgotten on an early `return` or an error.

```swift
func processFile(at path: String) throws {
    let handle = openFile(path)       // a hypothetical API
    defer { closeFile(handle) }       // will run in any case

    guard isValid(handle) else { throw NetworkError.unknown }
    try read(handle)
}
```

Rules: a `defer` cannot be interrupted from inside by `return`, `break` or `throw`; it runs after the return value is evaluated, but before control returns to the caller.

## Step 6. Control transfer statements

| Statement | What it does |
| --- | --- |
| `break` | immediately ends a loop or a `switch` |
| `continue` | stops the current iteration and starts the next one |
| `return` | returns a value and ends the function |
| `throw` | throws an error and ends the current function |
| `fallthrough` | in a `switch`, moves into the body of the next `case` without checking its condition |

```swift
let n = 3
switch n {
case 3:
    print("three")
    fallthrough
case 4:
    print("four")       // will run, although n != 4
default:
    print("other")
}
// three
// four
```

**Loop labels** let you control an outer loop from an inner one:

```swift
outer: for i in 1...3 {
    for j in 1...3 {
        if j == 2 { continue outer }
        if i == 3 { break outer }
        print(i, j)
    }
}
// 1 1
// 2 1
```

## Step 7. Result and typed throws

**`Result<Success, Failure>`** — an enum with `.success` and `.failure`: an error as a value. Convenient for callbacks and for storing a result.

```swift
let result = Result { try fetchData(from: "https://example.com") }   // Result<String, any Error>
switch result {
case .success(let s): print(s)
case .failure(let e): print(e)
}
let value = try result.get()   // throws again
```

**Typed throws (Swift 6.0, SE-0413).** A function can specify a concrete error type. `throws(any Error)` is equivalent to a plain `throws`, and `throws(Never)` to a non-throwing function.

```swift
enum ParseError: Error { case empty, notNumber(String) }

func parse(_ s: String) throws(ParseError) -> Int {
    guard !s.isEmpty else { throw .empty }          // the context is inferred from the error type
    guard let n = Int(s) else { throw .notNumber(s) }
    return n
}

do {
    _ = try parse("abc")
} catch {
    print(error)   // error is specifically ParseError: notNumber("abc")
}
```

> For public APIs a plain `throws` remains the best default: a rigidly fixed error type gets in the way of API evolution. Typed throws make sense inside a module, in generic code that propagates closures' errors, and in Embedded Swift.

## Common mistakes

- `try!` in a place where an error is possible → the app crashes.
- `catch {}` with no logging or handling — the error vanishes without a trace.
- `try?` where you need the reason for the error: it is lost.
- Expecting `defer` to run after the code of an outer scope rather than its own.
- Adding a `defer` after an early `return` may already have fired — it won't be registered.
- Expecting `fallthrough` to check the next `case`'s condition.
- Throwing `fatalError` instead of a handleable error for a normal scenario.

<details>
<summary>A tricky question: when does defer run relative to return?</summary>

The expression in `return` is evaluated first, then the `defer` blocks run in reverse order, and only after that control returns to the caller. Changing the returned variable inside `defer` does not affect the value that has already been evaluated.

</details>

## Cheat sheet

```swift
enum E: Error { case bad }
func f() throws -> Int { throw E.bad }

do { try f() } catch E.bad { } catch { /* error */ }
let a = try? f()          // Int?
let b = try! f()          // crash on error

func g(_ c: () throws -> Void) rethrows { try c() }

defer { cleanup() }       // LIFO, on leaving the nearest scope

func h() throws(E) { throw .bad }   // typed throws, Swift 6
Result { try f() }        // Result<Int, any Error>

switch x { case 1: fallthrough; case 2: break; default: break }
outer: for ... { for ... { continue outer } }
```

## Self-check questions

<details>
<summary>1. How do try, try? and try! differ?</summary>

`try` — a call inside `do-catch` or in a `throws` function; `try?` turns an error into `nil`; `try!` crashes the app on error.

</details>

<details>
<summary>2. What is rethrows for?</summary>

For higher-order functions that throw an error only when the closure passed in throws; without a throwing closure `try` is not needed.

</details>

<details>
<summary>3. What is the order of several defers?</summary>

Reverse (LIFO): the last declared runs first; each one on leaving its own nearest scope.

</details>

<details>
<summary>4. What does fallthrough do?</summary>

It moves into the body of the next `case` without checking its condition. By default a `switch` in Swift does not "fall through" as in C.

</details>

<details>
<summary>5. What is typed throws and when should you use it?</summary>

`throws(MyError)` — the function throws only the specified type. Inside a module, in generic code and for Embedded; for public APIs, plain `throws`.

</details>

<details>
<summary>6. How does Result differ from throws?</summary>

Result is a value that can be stored and passed around (callbacks), `throws` is a built-in mechanism with `try`/`catch`. It is easy to convert between them: `Result { try ... }` and `try result.get()`.

</details>

## Sources

- [Error Handling — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [Control Flow — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/)
- [SE-0413: Typed throws](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md)
- [SE-0230: Flatten nested optionals resulting from try?](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0230-flatten-optional-try.md)
