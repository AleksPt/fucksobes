---
title: "What is Swift Package Manager (SPM) and how do you use it?"
category: tooling
order: 27
---

Swift Package Manager is the official Swift dependency manager and build system, built into Xcode and the command line (`swift build`, `swift test`). A package is described by a `Package.swift` manifest written in Swift itself, which specifies products, targets, dependencies and supported platforms.

Usage in Xcode: **File → Add Package Dependencies…**, enter the repository URL, choose a version rule (`Up to Next Major`, an exact version, a branch, a commit) and the targets to add the package to. Versions are pinned in `Package.resolved`.

In the manifest, dependencies are added like this:

```swift
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0")
],
targets: [
    .target(name: "App", dependencies: ["Alamofire"])
]
```

Packages can also be created locally to split a project into modules, which is convenient for a modular architecture. SPM supports binary targets (XCFramework), resources, plugins and multiple platforms.
