---
title: "Does Int, for example, support copy-on-write?"
category: memory
order: 56
---

No. It is not about mutability (`var x = 1; x += 1` works): COW is needed by types with a shared buffer on the heap, while `Int` stores its value directly in the variable, so there is nothing to share when it is copied.
