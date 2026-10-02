---
title: "Why does a UIActivityIndicator keep spinning after the app is stopped?"
category: uikit
order: 147
---

The activity indicator is animated by Core Animation, not by the app's code. When an animation starts, the app hands its description to the render server (a system process), and that process computes and draws the subsequent frames independently of the app.

So when the app is "stopped" (the main thread is paused in the debugger, blocked by long-running work, or the app has been backgrounded and become suspended), an animation that has already been submitted keeps going: the render server continues to execute it until the layer is removed. The indicator keeps "spinning" even though the app's code is not running. This is also why the animation does not freeze when the main thread is busy: it does not depend on that thread (unlike frames the app draws itself).

If the main thread is blocked, however, the app cannot update its state (stop the indicator, show the result): the animation continues, but the interface stops responding to touches.
