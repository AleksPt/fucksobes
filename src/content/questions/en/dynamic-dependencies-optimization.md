---
title: "When the compiler applies its own optimizations, can it additionally optimize dynamic dependencies?"
category: tooling
order: 10
---

No, the compiler **cannot fully optimize dynamic dependencies** the way it can static ones: dynamic libraries remain external and are linked with the app only at runtime. This limits what the compiler can do.

`@inlinable` is a partial exception: such a function exports its body as part of the module's interface, and the compiler can inline and specialize it in the client's code (generic code included) even across a module boundary. The optimizer decides whether to use the body, and the library author marks the functions. The unofficial `@_alwaysEmitIntoClient` works similarly: the client always gets its own copy of the function. All other calls across a dynamic library boundary remain ordinary calls.
