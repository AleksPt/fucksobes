---
title: "What is the difference between CocoaPods, Carthage and SPM? What are their pros and cons?"
category: tooling
order: 28
---

**CocoaPods**
- Pros: a huge library registry, simple integration, a mature tool.
- Cons: modifies the project and creates a workspace, requires Ruby, the separate Pods project slows down the build, and the project is in maintenance mode.

**Carthage**
- Pros: does not interfere with the project, dependencies are built into binary frameworks, and there is no central registry.
- Cons: manual integration, slow rebuilds, weak support for new features, rarely used.

**Swift Package Manager**
- Pros: built into Xcode and Swift, needs no installation, the manifest is written in Swift, integrates with the build system, supports resources, binary targets and plugins, and is well suited to splitting a project into modules.
- Cons: some older libraries, especially Objective-C ones with a custom build, are only partially supported; less flexibility in build configuration than CocoaPods.

For new projects SPM is the choice, while CocoaPods and Carthage remain in older projects and for libraries that don't support SPM yet.
