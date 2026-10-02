---
title: "Tell me about tools that help build a project's dependency graph"
category: tooling
order: 51
---

- **`swift package show-dependencies`** is a built-in SPM command. It prints the current package's dependency tree as text, `JSON` (`--format json`) or `dot` format (`--format dot`), which you can feed to Graphviz to get a visual graph. It shows both direct and transitive dependencies of the package.
- **Xcode → Project Navigator → Package Dependencies.** For projects that use SPM, Xcode itself shows the list of connected Swift packages and their versions as a tree right in the project navigator. No third-party tools are needed, but there is no visual graph of the links between the app's own modules.
- **Tuist (`tuist graph`).** A tool for describing and generating Xcode projects that has a dedicated command for building a visual graph of dependencies between all of the project's targets and modules. It is especially handy for catching unexpected or unnecessary links between modules in modular projects.
- **`xcodebuild -list` / build reports.** It doesn't build a dependency graph as such, but `-list` shows all of the project's targets and schemes, and the Build Timing Summary shows the actual build time of each target, which is often used together with the dependency graph to understand which nodes of the graph are the most expensive in practice.
- **Third-party scripts and module-boundary linters.** In large modular projects, people often write their own CI checks: they parse `Package.swift` or the target settings and compare the actual dependencies with the allowed rules (for example, "the `Core` module must not depend on `Features`"), building a graph along the way for a report or visualization.

For dependency managers at the third-party library level, lock files play a similar role: `Package.resolved` for SPM, `Podfile.lock` for CocoaPods and `Cartfile.resolved` for Carthage. They also let you reconstruct the project's full dependency tree (including transitive dependencies) at a given moment.
