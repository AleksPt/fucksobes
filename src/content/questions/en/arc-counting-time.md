---
title: "When does ARC count references?"
category: memory
order: 17
---

ARC counts references every time a class instance is assigned to a property, constant, or variable: by default such a reference is strong and increments the count. When the instance is no longer needed, that is, no strong references to it remain, ARC frees its memory.

Counting applies only to class instances: structs and enums are value types, and ARC does not count them.
