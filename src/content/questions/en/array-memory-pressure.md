---
title: "What happens to memory if you fill an array with a huge number of elements? Is there a difference between reference and value types?"
category: memory
order: 72
---

A Swift array stores its elements in a single contiguous buffer on the heap. When capacity runs out, the buffer grows: a new one, roughly twice as large, is allocated, the elements are moved over, and the old one is freed. So at the moment of growth, memory for both the old and the new buffer is needed at once, which can become a peak load for very large arrays. If the size is known, call `reserveCapacity(_:)` up front.

**An array of reference types (classes).** The buffer holds only pointers (8 bytes each), while the objects themselves are allocated separately on the heap, and each has a header (metadata and the reference count, 16 bytes). In total, each element takes more memory, the objects are scattered across the heap (worse cache locality, fragmentation), and every `malloc` and refcount operation slows execution down. When the array is copied, only the pointers are copied (copy-on-write), and the objects are shared.

**An array of value types (structs).** The elements sit directly in the buffer, with no headers and no separate allocations. Memory is denser and faster, but one contiguous block of memory has to be found in its entirety, and on growth the whole volume is copied, not just pointers. If the struct has internal references (strings, arrays), their data still lives on the heap.

**When memory runs out.** iOS does not use swap: the system sends a warning (`didReceiveMemoryWarning`, `UIApplication.didReceiveMemoryWarningNotification`), and if the app keeps growing, it terminates it (jetsam, Out of Memory) without calling `applicationWillTerminate`. What to do: don't keep everything in memory (pagination, on-demand loading), free caches on the warning, use compact value types, and process data in batches.
