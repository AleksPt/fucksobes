---
title: "How does heap allocation work?"
category: memory
order: 75
---

Unlike the stack, the heap is a region of memory from which you can request blocks of **arbitrary size at an arbitrary time**, and it is where values whose size or lifetime is unknown in advance end up: class instances, closures that capture state, and also value types with variable-size fields.

How it works, step by step:

1. When an object needs to be created, the runtime turns to the **memory allocator** (`malloc` and its wrappers in the Swift runtime) and requests a block of the needed size.
2. The allocator looks for a suitable free region among already freed blocks (using free lists) or, if there is none, expands the managed memory region it gets from the system.
3. The found or newly allocated block is marked as in use and its address is returned; only a **pointer** to that heap address stays on the stack.
4. When the object is no longer needed (in Swift, when the ARC reference count has reached zero), the memory is returned to the allocator via `free`, and the block becomes available for reuse again.

Unlike the stack, where freeing is just moving a pointer, here the allocator has to **find** a suitable block and **deal with fragmentation**: if the heap is full of interleaved used and freed blocks of different sizes, finding a large contiguous region is harder and more expensive. Therefore:

- allocating and freeing heap memory is slower than on the stack;
- accessing data on the heap (through a pointer held on the stack) requires an extra dereference;
- the heap is shared by the whole process rather than per thread, so access to it is synchronized at the allocator level, which also adds overhead when objects are created from multiple threads.

```swift
final class Session {
    let id: UUID
    init(id: UUID) { self.id = id }
}

let session = Session(id: UUID())
// Only the `session` pointer is on the stack;
// the Session object itself is allocated on the heap via the allocator
```
