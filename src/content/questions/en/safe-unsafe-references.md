---
title: "Safe and unsafe references?"
category: memory
order: 31
---

`weak`: ARC zeroes it automatically when the instance is deallocated, so accessing a freed object is impossible. With `unowned`, a value is always expected: ARC does not set it to `nil`, and accessing it after deallocation is a runtime error.

**Unsafe** — `unowned(unsafe)`: an unsafe unowned reference, to be used only when you guarantee that the object is alive.

**The difference between `unowned` and `unowned(unsafe)`.** A regular `unowned` is safe: when you access a freed object, Swift checks the count and stops the program with a clear error (a trap), and the reference itself takes part in ARC and requires atomic operations. `unowned(unsafe)` does not take part in reference counting and does no checks, so it is slightly faster, but accessing a freed object leads to undefined behavior (access through a "dangling" pointer).
