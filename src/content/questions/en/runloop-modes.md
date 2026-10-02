---
title: "What modes (priorities) does a run loop have?"
category: concurrency
order: 71
---

A run loop's mode determines which event sources and timers are being processed at the moment. The main modes:

- `default` (`RunLoop.Mode.default`): normal app operation;
- `tracking` (`UITrackingRunLoopMode`): enabled during scrolling and other continuous gestures; only sources added for this mode are processed in it;
- `common`: not a separate mode but a set of modes (`default` and `tracking`) to which you can add a source so that it works in each of them.

A typical problem: a timer created with `Timer.scheduledTimer` is added in `default` mode, and while the user is touching the screen and scrolling (`tracking` mode), the timer does not fire. The fix is to add it to the common set of modes: `RunLoop.main.add(timer, forMode: .common)`.
