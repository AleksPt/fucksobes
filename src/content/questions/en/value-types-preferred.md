---
title: "Why does Apple recommend using value types by default? When should you use which?"
category: swift
order: 136
---

Apple advises starting with structs and moving to classes when they are really needed. Reasons:

- **No shared mutable state.** Each copy is independent: changes in one place do not affect others, so the code is easier to reason about and there are no unexpected side effects.
- **Thread safety.** Independent copies need no synchronization, so there are no data races on other threads' copies (but shared access to a single variable still has to be protected).
- **Less overhead.** Structs have no ARC or retain cycles, they are often allocated on the stack, and the standard library collections use copy-on-write.
- **Predictability** and good compatibility with protocols.

Choose a class when you need object identity, a shared mutable instance (a service, a cache, a manager), inheritance, or compatibility with Objective-C and Cocoa (`NSObject`, `UIViewController`). A caveat: a struct that contains a reference type is copied only by reference to it.
