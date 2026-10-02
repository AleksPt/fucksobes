---
title: "Why doesn't a struct have deinit?"
category: swift
order: 153
---

`deinit` is a method that is called when ARC deallocates an instance of a reference type: it is needed to release resources (close a file, remove an observer) before the object is removed from the heap. The moment of the call is determined by the reference count.

A struct (a value type) has neither a reference count nor shared ownership: the value is copied, belongs to a single variable, and is destroyed along with it (on leaving the scope or together with its owner). There is no clear "the last reference is gone" moment to which a `deinit` could be tied.

If you need to perform cleanup for a value, there are options:

- wrap the resource in a class and write `deinit` there;
- use an explicit `close()` / `cleanup()` method;
- starting with Swift 5.9, `~Copyable` structs **do** have `deinit`: they have a single owner, so the moment of destruction is well defined.
