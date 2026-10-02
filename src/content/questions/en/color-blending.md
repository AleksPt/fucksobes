---
title: "What causes color blending?"
category: uikit
order: 140
---

Color blending is a situation where the GPU has to blend the colors of several layers stacked on top of each other, because the top layer is translucent. For an opaque layer the GPU simply takes its pixel, while for a transparent one it computes alpha compositing with the layers below, which is more expensive and slows down rendering when there are many layers.

What causes it:

- layers and views with `alpha < 1`, `isOpaque = false` and a transparent `backgroundColor` (`.clear`);
- images with an alpha channel (PNGs with transparency), even if the transparency is not used;
- labels and cells with a transparent background on top of other views;
- nested translucent layers and shadows.

How to detect it: in the simulator, **Debug → Color Blended Layers** (areas where blending happens are highlighted in red, optimized areas in green) or in Instruments (Core Animation).

How to reduce it: set an opaque `backgroundColor`, set `isOpaque = true`, use images without an alpha channel, simplify the hierarchy, don't make everything transparent, and for text on an opaque background set the label's background color.
