---
title: "Will the app launch faster with static dependencies or with dynamic ones?"
category: tooling
order: 6
---

The app launches faster with **static dependencies**.

- **Static**: launch is faster, since everything is already linked.
- **Dynamic**: launch is slightly slower because of loading and linking at runtime.

**Why?**

1. Static dependencies are already built into the executable at compile time. At launch the system doesn't need to find, load and link external libraries: everything is ready in a single file.
2. Dynamic dependencies require extra operations: the OS has to find the library in the file system, load it into memory and link the library's functions to the app. These steps increase the launch time.
