---
title: "What is a dependency manager? What is it used for? Which ones have you used?"
category: tooling
order: 24
---

A dependency manager automates adding third-party libraries: it downloads the required versions, resolves dependencies between them, integrates them into the project and updates them according to version rules (semver). You don't have to copy code by hand, and versions are pinned and reproducible for the whole team.

There are three main ones in iOS:

- **Swift Package Manager (SPM)** is built into Xcode and Swift and is the main option today;
- **CocoaPods** is the oldest and most widespread, uses a `Podfile`, creates a workspace and connects dependencies through a separate `Pods` project;
- **Carthage** builds dependencies into ready-made frameworks (XCFrameworks) that are added manually; uses a `Cartfile`.

Sometimes dependencies are added manually, by copying the sources into the project or using ready-made XCFrameworks (binary dependencies). For reproducibility, versions are pinned in lock files (`Package.resolved`, `Podfile.lock`, `Cartfile.resolved`).
