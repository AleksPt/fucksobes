---
title: "What are zombie objects?"
category: memory
order: 49
---

A zombie object is an already deallocated object that is still being sent messages, that is, it is accessed through a dangling reference. Without diagnostics this is undefined behavior, usually a crash (`EXC_BAD_ACCESS`). If you enable the Zombie Objects option in the Xcode scheme (`NSZombieEnabled`), the object is turned into a special `_NSZombie_` instead of being freed: when it is accessed, the class and selector are printed to the console and the program terminates.

In safe Swift this is only possible with `unowned(unsafe)` and `Unmanaged`: a `weak` reference becomes `nil`, and reading a regular `unowned` reference to a deallocated object terminates the program. The side table has nothing to do with zombies: it only holds the counts while `weak` references point to it.
