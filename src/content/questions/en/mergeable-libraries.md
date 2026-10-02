---
title: "What are mergeable libraries?"
category: tooling
order: 46
---

**Mergeable Libraries** is an Xcode 15+ mechanism that gives dynamic frameworks the build speed of dynamic linking during development and the launch speed typical of static linking in the release build.

The problem it solves: dynamic and static linking have opposite trade-offs.

- **Dynamic frameworks** are rebuilt quickly during development (there is no need to relink the whole app when one module changes), but they slow down app launch: the system has to find, load and link each `.dylib` at startup.
- **Static libraries** launch faster (all the code is already in a single binary), but every change in any module requires relinking the entire executable, which is slower in the development loop.

Mergeable libraries let you keep frameworks dynamic during development (fast incremental builds) and, when archiving for release, **merge** them into the app's single binary as if they had been static from the start, getting a fast launch without switching the linking type by hand.

It is enabled in the target settings:

- on the app target: `MERGED_BINARY_TYPE` ("Create Merged Binary") set to `automatic`: Xcode itself builds the direct framework dependencies as mergeable and merges them in release builds;
- manually: `MERGED_BINARY_TYPE = manual` on the app and `MERGEABLE_LIBRARY = YES` ("Build Mergeable Library") only on the frameworks that should be merged. Xcode passes the linker flags (`-make_mergeable`, `-merge_framework`) itself.

Configurations are told apart automatically: in Debug (an unoptimized build) the libraries stay ordinary dynamic ones and are linked via reexport, for fast iteration; merging happens in Release and archives. Only direct dependencies are merged, and the merged frameworks are removed from the bundle, so everything that referenced them (extensions, tests) must be pointed at the resulting binary.
