---
title: "Does ARC work with functions and closures?"
category: memory
order: 71
---

Yes. A closure is a reference type: it consists of a pointer to code and a context with the captured values. If a closure captures something and "escapes" (`@escaping`), its context is allocated on the heap and managed by ARC: assigning the closure to a property or passing it on performs a `retain`, and releasing it performs a `release`. When the context's count reaches zero, the context is destroyed, and the captured references are released along with it.

This is where a retain cycle comes from: if an object stores a closure and the closure strongly captures that object (`self`), the counts never reach zero. The cycle is broken with a capture list, `[weak self]` or `[unowned self]`.

Exceptions:

- non-escaping closures can keep their context on the stack, without ARC;
- functions without captures (global, static, closures with no outside values) have no context, so there is nothing to count;
- a method passed as a value (`obj.method`) captures `obj` and keeps it alive.
