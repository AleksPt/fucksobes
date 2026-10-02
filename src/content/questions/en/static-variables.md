---
title: "What is special about static variables?"
category: swift
order: 41
---

A static variable (a type property) belongs to the type itself rather than to an instance: there is exactly one copy, no matter how many instances are created. It is suitable for values shared by all instances of the type (the analog of a static variable in C).

Features of stored type properties:

- they must have a default value, because the type itself has no initializer that could assign one;
- they are initialized lazily on first access and are guaranteed to be initialized only once, even under simultaneous access from several threads; the `lazy` marker is not needed;
- they can be either variables or constants.
