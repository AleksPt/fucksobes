---
title: "How often is the UI updated?"
category: uikit
order: 130
---

The rate is limited by the screen refresh: 60 Hz on regular displays (one frame is about 16.7 ms) and up to 120 Hz on ProMotion (8.3 ms). The system synchronizes frame output with the display refresh (VSync), so within a single frame interval the app and the render server must manage to prepare and render the image.

The UI is not updated constantly but as needed: when something has changed (a view/layer property, an animation, scrolling, input), Core Animation commits a transaction at the end of the run loop pass and sends the changes for rendering. If nothing has changed, the app does not prepare new frames (the system simply keeps showing the last frame).

If the work on the main thread (layout, `draw`, data processing) does not fit within the frame interval, frames are dropped and stutters appear. For per-frame updates (your own animation), use `CADisplayLink`, which is called in step with the screen refresh, and for verification, Instruments (Core Animation, Time Profiler) and hitch metrics.
