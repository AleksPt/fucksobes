---
title: "What are singletons? What problems can they have? When should they be used, and how do you protect yourself?"
category: architecture
order: 16
---

A **singleton** is a class that returns the same instance no matter how many times it is requested: there is only one instance per process. It provides a global access point to the class's resources.

When to use it: where a single point of control is needed, for example for classes that provide a shared service or resource. Examples from Cocoa: `NSFileManager`, `NSWorkspace`, `UIApplication`.

The instance is obtained through a factory method (by convention, `shared…`); the class creates it lazily on first access and does not allow another one to be created.
