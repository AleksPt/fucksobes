---
title: "What are hitches? What is the difference between a commit hitch and a render hitch?"
category: uikit
order: 148
---

A **hitch** is a frame that is shown later than it should be: the user sees a stutter in scrolling or an animation. A frame must be ready by the time of vsync (about 16.7 ms at 60 Hz, 8.3 ms at 120 Hz); otherwise the previous frame stays on screen.

A frame's path goes through two phases, and either can miss the deadline:

- **Commit hitch**: the **commit** phase in the app did not finish in time. The main thread spends too long on layout, `draw(_:)`, image preparation and constraint solving, and fails to hand the layer tree over to the render server in time. Causes: heavy work on the main thread, complex Auto Layout, image decoding on the main thread.
- **Render hitch**: the **render** phase in the render server did not finish in time. The app delivered its data on time, but the GPU/render server could not draw the frame. Causes: offscreen rendering, blending of many translucent layers, shadows without `shadowPath`, rounded masks, images that are too large.

How to tell them apart: in Instruments, the **Animation Hitches** template shows which phase the frame was late in, along with the **hitch time ratio** metric (milliseconds of delay per second of animation). A commit hitch is fixed by offloading the main thread, a render hitch by simplifying layer rendering.
