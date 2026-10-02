---
title: "How do you move data from one memory region to another using Swift's unsafe features?"
category: memory
order: 63
---

For this you use unsafe pointers: `UnsafeMutablePointer<T>`, `UnsafeMutableRawPointer`, the buffer variants such as `UnsafeMutableBufferPointer`, and helper functions. Responsibility for correctness and lifetime passes to the developer.

**From the stack to the heap:** allocate memory for the value and initialize it with a copy.

```swift
var local = 42                                   // a value on the stack
let heap = UnsafeMutablePointer<Int>.allocate(capacity: 1)
heap.initialize(to: local)                        // a copy on the heap
heap.pointee = 43
heap.deinitialize(count: 1)
heap.deallocate()                                 // the memory must be freed manually
```

**A temporary pointer to an existing value:** `withUnsafeMutablePointer(to: &local) { ptr in ... }` — the pointer is valid only inside the closure and must not escape it.

**Copying blocks:** `UnsafeMutableRawPointer.copyMemory(from:byteCount:)`, `UnsafeMutablePointer.moveInitialize(from:count:)` (moves values, leaving the source uninitialized), `withUnsafeBytes` for reading bytes, and `bindMemory(to:)` and `assumingMemoryBound(to:)` for interpreting the type. To pass an object reference to C code and back, there is `Unmanaged` (`passRetained`, `takeUnretainedValue`).

Rules: respect alignment, initialize before reading, deinitialize ARC-managed types before deallocating, and don't use the pointer after `deallocate`.
