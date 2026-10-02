---
title: "How does memory management work in Swift (ARC)?"
category: memory
order: 15
---

**ARC** (Automatic Reference Counting) automatically counts references to objects and frees the memory of those that no longer have any strong references.

Before ARC there was MRC, where `retain`/`release` calls were placed by hand. With ARC you don't have to do that: the compiler inserts these calls at compile time, while the reference counting itself happens at runtime. ARC works only with reference types.

**How references are counted**

- When an object is created, its reference count is 1.
- Each new reference to the object increments the count by 1, and removing a reference decrements it by 1.
- When the strong reference count reaches 0, ARC frees the object's memory (`release`).

**Three kinds of references:** strong, weak, and unowned.

- Strong references increment the strong reference count and keep the object in memory.
- If there are no strong references, the object's fate depends on its lifecycle and on whether weak or unowned references exist: the object either stays in memory or is deallocated.

**Where the counts are stored.** The strong and unowned reference counts are stored in the object itself. When a weak reference appears, the object gets a side table: it contains a pointer to the object, the object contains a pointer to it, and all the counts move into this table. If there are no strong references but weak ones remain, the object is deallocated, and its side table stays.
