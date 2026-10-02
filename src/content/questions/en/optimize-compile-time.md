---
title: "How do you optimize a program's compile time?"
category: tooling
order: 17
---

First measure, then optimize: in Xcode, enable the build timing report (`Build Timing Summary` in the build log), and for Swift use the flags `-Xfrontend -warn-long-function-bodies=<ms>` and `-warn-long-expression-type-checking=<ms>` to find slow functions.

What usually helps:

- **Code.** Specify types explicitly in complex expressions (long array and dictionary literals, operator chains), simplify nested closures, avoid unnecessary type inference.
- **Modularity.** Split the project into modules (SPM packages, frameworks) so that only the affected part changes and is recompiled; reduce the dependency graph.
- **Build settings.** For Debug: `Compilation Mode: Incremental`, `Debug Information Format: DWARF` (without dSYM), `Build Active Architecture Only = Yes`, and disabling unnecessary phases and scripts (run them only when their inputs change).
- **Dependencies.** Use prebuilt binaries (XCFramework) instead of compiling large third-party libraries.
- **Cache and hardware.** Enable build caching, use faster machines and a shared cache in CI.
