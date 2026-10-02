---
title: "Access modifiers"
category: swift
order: 31
---

Access modifiers restrict the visibility of an entity (a type, property, method, or initializer) to code in other files and modules. Swift has six levels, from the most open to the most restrictive:

- `open` and `public` — the entity is accessible from any file in its module and from modules that import it;
- `package` — accessible from all files in its package, but not outside it;
- `internal` — accessible from any file in its module, but not outside it;
- `fileprivate` — accessible only in the file where it is declared;
- `private` — accessible only within the declaration and its extensions in the same file.

`open` applies only to classes and their members: unlike `public`, it allows subclassing and overriding members in other modules. If no level is specified, `internal` is used by default. An entity cannot be defined in terms of a type with a stricter access level: for example, a `public` variable cannot have an `internal` type.
