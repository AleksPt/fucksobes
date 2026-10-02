---
title: "What problems come up when using ARC?"
category: memory
order: 23
---

The main problem is the **retain cycle**: two objects reference each other with strong references, which causes a memory leak, and the objects cannot be freed.

The second problem involves `unowned` references: if you access an object through an `unowned` reference and at that moment there are no strong references to it, the app will crash.
