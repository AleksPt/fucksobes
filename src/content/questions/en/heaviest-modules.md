---
title: "How do you find the heaviest (slowest to build) modules in a project?"
category: tooling
order: 50
---

The starting point is to enable the build timing report: `Product → Perform Action → Build with Timing Summary` (or the `-showBuildTimingSummary` flag of `xcodebuild`). At the end of the log a table appears with the time spent on each **target** separately, so you can immediately see which modules take longer to build than the others, not just the total time of the whole build.

You can then break this time down in more detail:

- **Xcode's build report (Report Navigator).** After a build, the log can be expanded by each phase and each file inside a module, to understand what exactly inside a heavy target takes the most time: compiling specific files, linking or scripts.
- **Swift compiler diagnostic flags.** `-Xfrontend -warn-long-function-bodies=<ms>` and `-Xfrontend -warn-long-expression-type-checking=<ms>` show warnings right in the build log for the slowest functions and expressions, which is how you find the "heavy" files inside an already identified slow module.
- **Third-party build log analysis tools** (for example, `.xcactivitylog` parsers) build clear charts and tables of the compile time of each target and file from the same data Xcode collects, but are more convenient for comparing builds and tracking regressions over time.
- **Module cache and incrementality.** If, after the first (non-cold) build, a particular module is still rebuilt almost every time, check its dependencies: the likely cause is that it depends on a frequently changing module, or that changes that could have stayed internal touch its public interface.

A "heavy" module is usually sped up the same way builds in general are sped up: split it into smaller independent parts, remove unnecessary transitive dependencies, add explicit types in complex expressions and move slow scripts into conditional phases that run only on real changes.
