---
title: "What is the difference between static and dynamic linking of external dependencies?"
category: tooling
order: 5
---

Static linking bakes dependencies into the app at compile time, while dynamic linking works at runtime and lets you update dependencies separately from the app.

**Static linking**

- **When it is linked:** at compile time.
- **How it works:** the library's code is included in the app's executable.
- **Result:** the app is self-contained, because the library is built into it.
- **Pros:** faster launch, since everything is already linked; no dependence on external files.
- **Cons:** the app gets larger; when the library is updated, the app has to be recompiled.

**Dynamic linking**

- **When it is linked:** at execution time (runtime).
- **How it works:** the library is loaded separately from the app and linked at launch.
- **Result:** the app depends on an external file (the dynamic library).
- **Pros:** smaller app size; libraries are easier to update, since no recompilation is needed.
- **Cons:** slightly slower launch because of loading; the app may not work if the required library is missing.
