---
title: "Swizzling: what are the risks of using it?"
category: swift
order: 87
---

Swizzling replaces a method's implementation at runtime, so the main risks come from the fact that you are changing the behavior of someone else's code without seeing its assumptions:

- The replaced implementation may violate assumptions that the original class relies on, especially if it is a class you do not own.
- If the original implementation is called with a different selector than the one the method was invoked with, methods that depend on `_cmd` break (an example from Mike Ash is `mouseEntered:`/`mouseExited:` in `NSResponder`).
- If several parties swizzle the same method (your code, dependencies), the result is unpredictable; it is recommended to prefix the names of the replacing methods to avoid collisions.
- Skipping the call to the original implementation may break its internal state.
- Framework updates may break a swizzle that depends on their internal structure.

So swizzling should be applied narrowly and defensively, and where possible, avoided altogether.
