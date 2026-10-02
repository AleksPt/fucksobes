---
title: "How many stacks and heaps are there in an app?"
category: memory
order: 4
---

Each thread has its own stack, while the heap is shared by the process: for Swift code there is one, although the allocator (malloc zones on Apple platforms) may split memory into several zones internally.
