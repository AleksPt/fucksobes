---
title: "What do you do if the interface lags (how do you track down what may be causing it)?"
category: uikit
order: 69
---

Lags come in two kinds: a hang is a delay in responding to a discrete user action (noticeable from about 100 ms), and a hitch is an interruption of smooth motion (scrolling, animation) when a frame misses vsync. The cause is usually the main thread: it is either busy running code or blocked waiting for a resource; a hitch can also be caused by a picture that is too complex to render (a render hitch).

How to track it:

- Instruments: the Time Profiler, CPU Profiler or Animation Hitches templates (preferably on a real device);
- Thread Performance Checker in the scheme and Hang Detection on the device (Settings > Developer);
- XCTest performance tests with `measure(_:)`;
- in production: Xcode Organizer and `MetricKit`.

What to do: use the main thread only for UI work and move everything else to the background (Swift concurrency, GCD, `OperationQueue`); keep in mind that a `Task` inherits the actor context, so synchronous heavy work in it still blocks the main actor. In `draw(_:)` don't do I/O or complex computation, and call `setNeedsDisplay()` only when needed. Apple does not name a separate limit for data source code: the guideline is the frame budget of 16.67 ms (60 Hz) or 8.33 ms (120 Hz), of which only a couple of milliseconds are left for the app's own work (layout, for example).
