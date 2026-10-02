---
title: "The main thread has a run loop. Is there an analogue on other threads?"
category: concurrency
order: 70
---

Yes: every thread has its own run loop object (`RunLoop.current`), which the system creates on first access. But on secondary threads it is not started automatically: you have to run it explicitly, after first adding at least one input source or timer, otherwise the run loop exits immediately.

A run loop on a secondary thread is needed if the thread communicates with other threads through ports or custom sources, uses timers, calls Cocoa `performSelector` methods, or lives a long time and performs periodic tasks. For a one-off task you can do without it.
