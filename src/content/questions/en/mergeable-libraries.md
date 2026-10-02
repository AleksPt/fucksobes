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

- on the framework target: `MERGEABLE_LIBRARY = YES` ("Create Mergeable Library" in Build Settings);
- on the app target: `MERGE_LINKED_LIBRARIES = YES` ("Merge Mergeable Libraries" / "Automatically Merge Libraries"), or explicitly through the linker flags `-make_mergeable` and `-merge_framework`.

You can also control this by configuration: for example, merge libraries only for Release builds and archives, leaving Debug dynamic for fast development iteration. This is exactly the behavior the Xcode templates set by default.
