---
title: "Inout. If we pass a value type through inout inside a method, where will it be stored: on the heap or on the stack?"
category: memory
order: 14
---

Most likely on the heap: it is not known what the parameter will ultimately be changed to, so its concrete size probably cannot be determined at compile time.
