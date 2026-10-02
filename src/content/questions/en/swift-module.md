---
title: "What is a module in Swift?"
category: swift
order: 108
---

A module is a unit of code distribution: a framework or an app that is built and shipped as a whole and is brought into other code with the `import` directive. In Xcode, each build target — an app, a framework, a library, unit tests — is a separate module, just as each Swift package (SPM) consists of one or more modules. The standard library is also a module (`Swift`), as are `Foundation` and `UIKit`.

Access levels depend on the module: `internal` (the default) is visible within its own module, while `public` and `open` are visible outside it. That is why, when splitting a project into modules, you separate the public interface from the implementation, speed up incremental builds, and delimit dependencies. If different modules contain types with the same name, they are distinguished by the module prefix: `ModuleA.Item`.
