---
title: "How do you optimize an app's launch time?"
category: tooling
order: 18
---

Launch is divided into stages: before `main` (loading dynamic libraries, `dyld`, initializers and `+load`) and after it (creating the window, the first screen). It is measured with Instruments (the App Launch template), MetricKit metrics and Xcode Organizer reports; Apple's target is a first frame in under 400 ms.

The main techniques:

- **Before `main`:** reduce the number of dynamic frameworks (replace them with static ones or merge them), remove `+load` and unnecessary static initializers, and reduce the binary size.
- **After `main`:** don't do heavy work in `application(_:didFinishLaunchingWithOptions:)`; defer initialization of analytics, SDKs, databases and networking (lazily) or move it to the background; don't block the main thread.
- **First screen:** show it quickly with a minimal set of data; load the rest after the UI appears, use a cache, simplify the layout.
- **Resources:** don't load large images and fonts up front.

Check the difference before and after on real devices and with a cold launch.
