---
title: "What means can you use to achieve encapsulation in Swift?"
category: swift
order: 37
---

**Encapsulation** in Swift is achieved through **access modifiers**:

1. **`open`** — accessible from any module; can be subclassed and overridden in other modules.
2. **`public`** — accessible from any module; cannot be subclassed or overridden outside the module.
3. **`internal`** (default) — accessible only within one module.
4. **`fileprivate`** — accessible only within one file.
5. **`private`** — accessible only within one scope (a class, struct, or extension).
