---
title: "How do you create an array of weak references?"
category: memory
order: 47
---

Options:

- write your own wrapper with a weak reference to the object and put it in the array;
- use `NSPointerArray` or `NSHashTable`;
- capture the objects weakly in closures and put the closures in the array.

`NSPointerArray` is a special array from **Foundation** that stores objects without incrementing their **reference count**. It supports **weak references**: objects can be freed when they are no longer needed. But a freed element is not removed from the array: an empty slot (`nil`) stays and counts toward `count`, so you have to remove such slots yourself with `compact()` (in practice it takes effect if you first add a `nil` with `addPointer(nil)`).
