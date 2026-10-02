---
title: "What is a Build Configuration?"
category: tooling
order: 43
---

A **Build Configuration** is a named set of build setting values used to build a target's product in a particular way. By default Xcode creates two configurations, **Debug** and **Release**, but you can add as many as you like.

A typical example: `Debug`, `Staging` and `Release` configurations for the same target, each with its own `API_BASE_URL`, its own compiler optimization level and its own set of conditional compilation flags (`#if DEBUG` / `#if STAGING`). When building, you pick the configuration you need (by choosing a scheme or with the `-configuration` option of `xcodebuild`), and Xcode substitutes the corresponding set of values.

```
Setting                   Debug          Release
─────────────────────────────────────────────────
SWIFT_OPTIMIZATION_LEVEL  -Onone          -O
API_BASE_URL             dev.api.com    api.com
ENABLE_TESTABILITY        YES            NO
```

Configurations, like build settings, are convenient to move into separate `.xcconfig` files (`Debug.xcconfig`, `Release.xcconfig`), which simplifies working with `project.pbxproj`, versioning and merging changes in a team.

A configuration is not the same as a **Scheme**: a scheme defines *what* and *how* to run (which target, tests, which environment arguments), and for each action (Run, Test, Archive) it specifies *which* build configuration to use.
