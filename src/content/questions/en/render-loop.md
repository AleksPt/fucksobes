---
title: "How does the full render loop (the frame drawing cycle) work?"
category: uikit
order: 141
---

Rendering a frame goes through two processes.

**In the app (the main run loop):**

1. **Event handling:** touches, timers, callbacks; code changes views and layers.
2. **Layout:** `updateConstraints`, `layoutSubviews`.
3. **Display:** `draw(_:)` for views marked as needing it, Core Graphics drawing into the layer's backing store.
4. **Prepare:** image decoding and format conversion.
5. **Commit:** packing the layer changes and sending them to the render server (at the end of a run loop iteration, by a Core Animation observer).

**In the render server (`backboardd`):**

6. **Decode/Draw:** preparing textures and executing animations.
7. **Render:** compositing layers on the GPU and outputting the frame to the display at VSync.

The whole cycle must fit within the frame interval (about 16.7 ms at 60 Hz, 8.3 ms at 120 Hz). If any stage runs long, the frame is skipped (a hitch). To offload the main thread, heavy work is moved to the background, `CATransaction`/`CADisplayLink` are used, images are cached, and offscreen rendering is avoided. All of this is monitored in Instruments (Core Animation, Time Profiler).
