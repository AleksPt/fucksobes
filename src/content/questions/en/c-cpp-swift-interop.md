---
title: "Can you combine C/C++ and Swift code in one project? If so, how?"
category: swift
order: 102
---

Yes.

**C.** C headers are imported the same way as Objective-C ones: through a bridging header or a module (module map). Swift automatically imports C functions, structs, enums, and constants. Pointers are turned into `UnsafePointer`, `UnsafeMutablePointer`, and `OpaquePointer`, and macros are partially supported (simple constants).

**C++.** Direct import of C++ into Swift appeared in Swift 5.9: you enable `C++ and Objective-C Interoperability` in the build settings (`-cxx-interoperability-mode=default`). Swift then sees C++ classes, structs, templates, and standard containers. Before that, wrappers in **Objective-C++** (`.mm` files) were used: C++ is called from Objective-C++, and an Objective-C facade class is exposed to Swift through a bridging header. The reverse also works: you can call Swift from C++ through a generated header.

Crossing between languages has overhead for type conversion and memory management (C/C++ has no ARC), so the integration boundaries are usually kept as small as possible.
