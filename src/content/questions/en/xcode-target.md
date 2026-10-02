---
title: "What is a Target in Xcode?"
category: tooling
order: 41
---

A **Target** precisely defines which product will be built from the project and contains the instructions for building it: which source files and resources go into the product, what its own build settings are and which steps (build phases) have to be performed.

A target's main **Build Phases** are executed in order and usually include:

- **Compile Sources**: compiling the source code that belongs to the target;
- **Link Binary With Libraries**: linking with frameworks and libraries;
- **Copy Bundle Resources**: copying resources (images, xibs, plists) into the resulting bundle;
- custom **Run Script** phases, for example running SwiftLint or generating code before compilation.

One project can contain several targets that use the same source code but build different products: for example, the main app, its widget extension and a separate target for unit tests. Each has its own set of files, dependencies and build settings, even though they all live in one `.xcodeproj`.

```
MyApp.xcodeproj
├── Target: MyApp          — main app
├── Target: MyAppWidget     — widget extension
└── Target: MyAppTests      — unit tests
```
