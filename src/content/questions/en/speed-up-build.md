---
title: "What tips do you know for speeding up a project build?"
category: tooling
order: 45
---

**Measure first, don't guess.** `Product → Perform Action → Build with Timing Summary` builds the project once and at the end shows how much time went to each category (compilation, linking, scripts); without this it isn't clear what is actually slowing the build down. You can also enable compiler diagnostics for the slowest functions and type expressions (`-Xfrontend -warn-long-function-bodies=200`, `-Xfrontend -warn-long-expression-type-checking=200`).

Then go through the common causes:

- **Don't run unnecessary scripts on every build.** Run Script phases (SwiftLint, code generation and so on) can be restricted to the needed configuration with "Based on dependency analysis" and `Input/Output Files`, so that Xcode skips the script if nothing has changed, or by checking `${CONFIGURATION}` inside the script, for example to run SwiftLint only for Debug builds.
- **Modularization.** Splitting the project into independent modules (Swift packages or separate targets) lets Xcode cache and rebuild only the changed modules rather than the whole project, and build independent modules in parallel.
- **Incremental builds.** The compiler rebuilds only the changed files and their dependencies. It helps to avoid "fat" files with many unrelated types and to break circular dependencies between modules.
- **Whole Module Optimization** (`SWIFT_WHOLE_MODULE_OPTIMIZATION`, part of `-O`): the compiler optimizes and parallelizes the compilation of all of a module's files at once; appropriate for Release, but it doesn't always speed up incremental Debug builds, where the speed of a single edit → build cycle matters more.
- **Explicit types in hot spots.** Complex type inference (long chains of `map`/`filter`/`reduce`, operators with overloads, large literal expressions) noticeably increases type-checking time; it helps to break the expression into steps or specify the type explicitly.
- **Parallel builds and the number of workers.** Xcode builds files in parallel by default; for CI, make sure enough cores are used and that `-parallelizeTargets` is enabled for `xcodebuild`.
- **Dependencies.** Fewer heavy third-party libraries and static links where justified: dynamic linking doesn't require a rebuild on every change to the dependent code; where library updates are rare, static linking wins instead, thanks to faster launch, though not a faster build.
- **Build cache and CI.** Use `Derived Data` and don't clean it without need; on CI, cache `Derived Data` and dependencies between runs if the system you use supports it.
