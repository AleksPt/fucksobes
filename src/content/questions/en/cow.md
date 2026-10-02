---
title: "What is Copy on Write? Give an example of the algorithm. At what moment does the mechanism kick in and what happens?"
category: memory
order: 52
---

**Copy-on-Write** is a memory optimization mechanism for collections (`Array`, `Set`, `Dictionary`). When a collection is copied or assigned, or passed to a function, no new object is created: the new variable refers to the same region of memory as the first one. The data is copied only on mutation, that is, when the collection is modified.

This significantly reduces memory use and improves performance. The mechanism can also be implemented for your own types.
