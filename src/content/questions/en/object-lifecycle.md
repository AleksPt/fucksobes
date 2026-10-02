---
title: "Describe an object's lifecycle (live, deiniting, deinited, freed, dead)"
category: memory
order: 35
---

**Live.** The object is alive, and its reference counts are set to 1. If a weak reference appears, a side table is created.

**Deiniting.** When the strong RC reaches **zero**, `deinit()` is called and the object moves to this state. Operations on strong references no longer work. Reading through an unowned reference terminates the program (a **trap**: "Attempted to read an unowned reference but object was already destroyed"), but new unowned references can still be added. If there is a side table, weak operations return `nil`. Two transitions are possible from this state:

- If there is no side table (that is, no weak references) and no unowned references, the object moves to the **Dead** state and is immediately removed from memory.
- If there are **unowned or weak references**, the object moves to the **Deinited** state.

**Deinited.** `deinit()` has finished, but unowned references (or a side table) remain. Operations on strong references are impossible, storing new unowned references is not allowed, and reading an unowned reference traps in the same way. If there is a side table, reading a weak reference returns `nil`, and storing into it is not allowed. When the unowned reference count reaches zero, the object is freed, and two outcomes are possible from there:

- If there are no weak references (and no side table), the object moves to **Dead**.
- If there are weak references (and therefore a side table), the object moves to the **Freed** state.

**Freed.** The object is completely freed and takes up no space in memory, but its side table is still alive. When the weak reference count reaches zero, the side table is also removed and its memory is freed, and the object moves to the final **Dead** state.

**Dead.** Nothing is left of the object except a pointer to it. The `HeapObject` pointer is freed from the heap, leaving no trace of the object in memory.
