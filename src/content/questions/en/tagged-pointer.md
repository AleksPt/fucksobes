---
title: "What is a tagged pointer?"
category: memory
order: 65
---

A tagged pointer is an Objective-C runtime optimization (on 64-bit platforms): small objects are stored not on the heap but directly in the pointer value itself. Some of the pointer's bits hold a tag (a marker and a class identifier), and the rest hold the data itself, for example the number of an `NSNumber`, the date of an `NSDate`, or a short `NSString`.

What this gives you:

- there is no need to allocate and free heap memory;
- `retain` and `release` do nothing for such a "pointer": it does not point to a real object;
- access to the value is faster, and memory is saved.

For the programmer this is transparent: you still work with `NSNumber` or `NSString` as objects, but their address is not a real memory address, and you must not rely on it (for example, by comparing pointers with `==`). The analog in Swift is small string optimization: short strings (up to 15 bytes of UTF-8 on 64-bit platforms) are stored inside the `String` value itself without a heap allocation.
