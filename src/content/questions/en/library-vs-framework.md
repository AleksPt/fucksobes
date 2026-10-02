---
title: "What is the difference between a library and a framework (in the context of Swift and Apple platforms)?"
category: tooling
order: 39
---

**Conceptually.** Your code calls a library: you decide when and what to use. A framework, by contrast, defines the skeleton of the app and calls your code (inversion of control): for example, UIKit itself calls `viewDidLoad`.

**In Apple's tooling.**

- **A library** is a file with compiled code: static (`.a`, the code is embedded into the app at build time) or dynamic (`.dylib`, loaded at launch). Code only, no resources.
- **A framework** (`.framework`) is a bundle: a binary (static or dynamic), headers, a module (`module.modulemap`/`.swiftmodule`), resources (images, storyboards, localizations) and an `Info.plist`. That is why a framework can store resources and be versioned.
- **An XCFramework** is a container for several builds of a framework or library (device, simulator, different architectures and platforms), and the standard for binary distribution.
- **A Swift package (SPM)** is a set of modules (libraries) that Xcode builds as static or dynamic.

Both kinds can be static or dynamic, and a module (`import`) is the unit of code distribution. The differences between static and dynamic linking are in app size, launch time and the ability to share code between apps.
