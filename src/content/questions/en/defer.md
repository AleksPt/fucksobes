---
title: "What is defer?"
category: swift
order: 113
---

`defer` postpones the execution of a block of code until the current scope is exited: a function body, a loop, a `do`, or an `if`, regardless of how it is exited — `return`, `throw`, `break`, or normal completion. It is usually used to release resources next to where they are acquired: close a file, release a lock, finish a transaction.

```swift
func read() throws {
    let file = try open()
    defer { close(file) }      // runs on any exit from the function
    try process(file)
}
```

If a scope has several `defer` blocks, they run in reverse order (LIFO): the last one declared runs first. A `defer` in a nested `if` block fires when that block is exited, so it runs earlier than the others:

```swift
func demo(flag: Bool) {
    defer { print("1") }
    defer { print("2") }
    if flag {
        defer { print("inner") }
        print("body")
    }
    print("end")
}
// demo(flag: true) prints: body, inner, end, 2, 1
```

Inside a `defer` you cannot exit the block (`return`, `break`, `throw`).
