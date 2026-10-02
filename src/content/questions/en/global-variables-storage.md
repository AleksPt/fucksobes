---
title: "Where are global variables usually stored?"
category: memory
order: 76
---

Global variables (declared outside any type or function, at the top level of a file) are stored neither on the stack nor on the heap, but in a separate area of the process: **static memory** (also split into the `data` and `bss` segments), which is allocated when the app is loaded and exists for its entire lifetime.

How it works:

- **Values known at compile time** (for example, literals) are "baked into" the executable: a `var` lives in the `data` segment, while an immutable value of a primitive type may end up in a read-only section.
- **Values that cannot be computed at compile time** get a zero-filled place in static memory (in a `bss`-like area), and the initializer code writes the value.
- In Swift, global variables (except those declared in `main.swift`) and `static` properties are **lazy**: the initializer runs on first access, thread-safely, once for the entire lifetime of the process (similar to `dispatch_once` in Objective-C). Top-level variables in `main.swift` are initialized right away, in the order the code executes.

```swift
let appConfig = AppConfig() // in any file except main.swift: its place in static memory
                             // is allocated up front, the initializer runs on first access
```

An important difference from the stack and the heap:

- this memory is not freed as code executes and is not managed by ARC like ordinary heap objects: it lives from process start to process exit;
- it is shared by the whole app and accessible from any thread, so access to mutable globals (anything that is not a `let`) must be synchronized yourself.
