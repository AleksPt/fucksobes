---
title: "On which queue must you work with user interface (UI) elements?"
category: concurrency
order: 14
---

On the main queue (the main thread): according to the `UIView` documentation, all manipulations of the interface must happen on the main thread, so `UIView` methods must be called from code running on it. The only exception is creating the view object itself.

`UIView` is declared `@MainActor`, so from Swift Concurrency you access the interface from the main actor's context.
