---
title: "What memory regions does a process have besides the stack and the heap?"
category: memory
order: 62
---

Besides the stack (local values and call frames) and the heap (dynamically allocated objects), a process's address space contains:

- **the code segment (text)** — the machine instructions of the program and its libraries; read-only and executable;
- **the data segment (data and bss)** — global and static variables (including `static let` and Swift global variables, which are initialized lazily and thread-safely, once); `bss` holds values that are not explicitly initialized and are zeroed at startup;
- **constants (rodata)** — string literals, type metadata tables, witness tables, and other immutable data;
- **thread-local storage** — data bound to a thread;
- **memory-mapped files** — files and dynamic libraries mapped into memory (`mmap`), as well as shared memory;
- **CPU registers** — the fastest "slots" for intermediate values.

Under the OS's management, memory is also classified by state: clean (can be restored from a file), dirty (modified, must be kept), and compressed (compressed by the system). iOS has no swap to disk, so when memory runs low, the system terminates the app. Values on the stack and the heap are only the part that the developer and ARC manage directly.
