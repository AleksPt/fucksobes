---
title: "How do you create an array of weak references?"
category: memory
order: 47
---

Options:

- write your own wrapper with a weak reference to the object and put it in the array;
- use `NSPointerArray` or `NSHashTable`;
- capture the objects weakly in closures and put the closures in the array.

`NSPointerArray` is a special array from **Foundation** that stores objects without incrementing their **reference count**. It supports **weak references** and automatically clears `nil` values, which lets objects be freed when they are no longer needed.
