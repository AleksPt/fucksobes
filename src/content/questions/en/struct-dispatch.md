---
title: "What dispatch do structs use?"
category: swift
order: 80
---

Static. Structs have no inheritance, so the method implementation is known at compile time, and at runtime execution jumps directly to it. The compiler sees the implementation being called and can optimize the code aggressively, for example by inlining. For comparison: class methods are called through the virtual method table by default.
