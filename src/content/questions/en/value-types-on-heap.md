---
title: "Can value types be stored on the heap?"
category: memory
order: 7
---

Yes: a value type describes copy semantics, not the place of storage. For example, `String` stores its character contents indirectly, on the heap, so creating such a string may require a heap allocation.

Another case: a large value in a variable of a protocol type does not fit in the existential container's inline buffer (three words), and heap memory is allocated for it. This can be worked around by implementing the struct with indirect storage and copy-on-write.
