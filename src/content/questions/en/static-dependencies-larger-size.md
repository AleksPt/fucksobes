---
title: "If the compiler optimizes them well enough, can the size of an app with static dependencies still be larger than with dynamic ones?"
category: tooling
order: 12
---

Yes, **an app with static dependencies can still be larger**, even if the compiler optimizes the code well. The reason is the very principle of static linking: optimizations (including removal of unused code, dead stripping) work within a single binary and don't remove copies of the same library in different binaries. If a static library is linked by the app, an extension and a framework, its code ends up in each of them, while a dynamic framework sits in the bundle as a single copy.

The opposite also happens: if only one binary uses the dependency, the linker takes only the needed object files from the static library, and the app may end up smaller than with a whole dynamic framework in the bundle.
