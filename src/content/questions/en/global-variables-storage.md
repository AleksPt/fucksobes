---
title: "Where are global variables usually stored?"
category: memory
order: 76
---

Global variables (declared outside any type or function, at the top level of a file) are stored neither on the stack nor on the heap, but in a separate area of the process: **static memory** (also split into the `data` and `bss` segments), which is allocated when the app is loaded and exists for its entire lifetime.

How it works:

- **Constants whose value is known at compile time** go into the `data` segment (or into a read-only section if it is an immutable value of a primitive type): the binary reserves memory for them in advance, and the value is already "baked into" the executable.
- **Variables with no initial value, or ones that require computation at startup**, go into the `bss` segment and are initialized by the runtime when the process starts.
- In Swift, global variables and `static` properties effectively behave like **`lazy`** ones: memory for them is allocated statically, but the initializer runs **lazily**, on first access, and thread-safely, once for the entire lifetime of the process (similar to `dispatch_once` in Objective-C).

```swift
let appConfig = AppConfig() // global variable: its place in static memory
                             // is allocated up front, the initializer runs on first access
```

An important difference from the stack and the heap:

- this memory is not freed as code executes and is not managed by ARC like ordinary heap objects: it lives from process start to process exit;
- it is shared by the whole app and accessible from any thread, so access to mutable globals (anything that is not a `let`) must be synchronized yourself.
