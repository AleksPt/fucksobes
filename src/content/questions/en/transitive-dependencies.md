---
title: "What are transitive dependencies?"
category: tooling
order: 48
---

**Transitive dependencies** are dependencies that come into a project not directly but implicitly, through other dependencies. If your project adds library A, and A itself depends on library B, then B becomes a transitive dependency of your project: you didn't specify it explicitly, but it still ends up in the build.

```
Your project
   └── A (direct dependency, listed in Package.swift/Podfile)
        └── B (transitive dependency, came along with A)
             └── C (also transitive, came along with B)
```

Dependency managers (SPM, CocoaPods, Carthage) resolve such chains automatically: they download not only what is specified explicitly but also everything the specified libraries require.

Pros: you don't need to find and add the dependencies of your dependencies by hand; the manager completes the full graph itself.

Risks:

- **Version conflicts (diamond dependency).** If the project directly depends on version 2 of library D, but A transitively requires version 1 of D, the manager has to resolve the conflict somehow (pick a compatible version or report an error if there isn't one).
- **Binary bloat.** Transitive dependencies increase the app size and build time, even if you never use their code directly.
- **Hidden security and maintenance risks.** A vulnerability in, or the end of support for, a transitive dependency you may not even know exists still affects your project.
- **Harder to control versions.** Updating one direct dependency can unexpectedly pull in new versions of several transitive ones.

That is why SPM, CocoaPods and Carthage have lock files (`Package.resolved`, `Podfile.lock`, `Cartfile.resolved`): they pin the exact versions of the whole tree, including transitive dependencies, so that the build is reproducible for the whole team and in CI.
