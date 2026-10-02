---
title: "What is the difference between a garbage collector and ARC?"
category: memory
order: 59
---

Both technologies free memory automatically, but in different ways.

**ARC** (Automatic Reference Counting) inserts `retain` and `release` calls at compile time and keeps a reference count for each object at runtime. As soon as the count hits zero, the object is destroyed immediately (and `deinit` is called). The behavior is deterministic: the moment of deallocation is predictable. The overhead is spread across the program's execution (atomic counter operations), and there are no collection pauses.

A **garbage collector** (Java, C#, Go) runs periodically as a separate process: it finds objects that are unreachable from the roots and frees them. The moment of deallocation is unpredictable, "stop the world" pauses and higher memory consumption are possible, but the collector can find and free reference cycles.

ARC's main drawback is that it cannot handle cycles: two objects with strong references to each other will not be freed, so the developer breaks them with `weak` or `unowned`. Formally, ARC is a kind of garbage collection based on reference counting, but not a tracing one.
