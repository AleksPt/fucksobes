---
title: "Name the property wrappers that declare value semantics."
category: swiftui
order: 27
---

These are `@State` and `@Binding`. Only `@State` is a source of truth: the view owns the value, and SwiftUI keeps it between recreations of the struct. `@Binding` is just a reference to someone else's value that allows reading and modifying it.
