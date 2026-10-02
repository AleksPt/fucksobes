---
title: "Which compiles faster, static dependencies or dynamic ones?"
category: tooling
order: 7
---

**Dynamic** dependencies build faster. The difference is not in compiling the sources but in linking.

- **Static**: at build time the linker copies the library's code into the binary, and a static library's archive is rebuilt whenever its code changes, so the build takes longer.
- **Dynamic**: the linker doesn't copy the code; it only records the symbol name and the library's path, so link time doesn't depend on the number of dynamic libraries. The actual binding is deferred until the app launches and is performed by dyld, which makes launch slower.
