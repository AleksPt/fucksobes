---
title: "When the compiler applies its own optimizations, can it additionally optimize dynamic dependencies?"
category: tooling
order: 10
---

No, the compiler **cannot fully optimize dynamic dependencies** the way it can static ones: dynamic libraries remain external and are linked with the app only at runtime. This limits what the compiler can do.
