---
title: "What is Bitcode?"
category: tooling
order: 38
---

Bitcode is an intermediate representation of a program (LLVM IR in a compact binary form) that the compiler could include in the app archive instead of ready-made machine code for all architectures. When the app was uploaded to App Store Connect, Apple itself compiled the bitcode down to final machine code for specific devices, and could recompile the app with a newer compiler and newer optimizations without requiring a new build from the developer. This was used for app thinning (reducing app size) and for moving to new architectures.

Limitations: all libraries (including third-party ones) had to contain bitcode, and debugging required symbol maps (BCSymbolMaps) to symbolicate crash reports.

Starting with Xcode 14, Bitcode is deprecated: the `ENABLE_BITCODE` setting is off by default, and the App Store no longer accepts bitcode builds or recompiles apps. For iOS, tvOS and watchOS it is simply disabled now. Today the app contains ready-made machine code.
