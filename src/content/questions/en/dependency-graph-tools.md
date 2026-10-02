---
title: "Tell me about tools that help build a project's dependency graph"
category: tooling
order: 51
---

- **`swift package show-dependencies`** is a built-in SPM command. It prints the current package's dependency tree as text, `JSON` (`--format json`) or `dot` format (`--format dot`), which you can feed to Graphviz to get a visual graph. It shows both direct and transitive dependencies of the package.
- **Xcode → Project Navigator → Package Dependencies.** For projects that use SPM, Xcode shows the connected Swift packages right in the project navigator; expanding a package reveals its contents. This works without third-party tools but gives neither a visual graph, nor a dependency tree, nor the links between the app's own modules.
- **Tuist (`tuist graph`).** A tool for describing and generating Xcode projects that has a dedicated command for building a visual graph of dependencies between all of the project's targets and modules. It is especially handy for catching unexpected or unnecessary links between modules in modular projects.
- **`xcodebuild -list` and the Build Timing Summary.** These are not tools for building a graph: `-list` only lists the project's targets and schemes, and the Build Timing Summary shows the build time of each target. They are used together with the dependency graph to understand which of its nodes are the most expensive in practice.
- **Third-party scripts and module-boundary linters.** In large modular projects, people often write their own CI checks: they parse `Package.swift` or the target settings and compare the actual dependencies with the allowed rules (for example, "the `Core` module must not depend on `Features`"), building a graph along the way for a report or visualization.

For dependency managers at the third-party library level, lock files play a similar role: `Package.resolved` for SPM, `Podfile.lock` for CocoaPods and `Cartfile.resolved` for Carthage. They also let you reconstruct the project's full dependency tree (including transitive dependencies) at a given moment.
