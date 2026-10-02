---
title: "How is a view with a fractional width that does not match the pixel grid (for example, 1.8) drawn?"
category: uikit
order: 125
---

Sizes in UIKit are specified in points, while the screen draws in pixels: on screens with `scale = 2` one point equals two pixels, and with `scale = 3` it equals three. A width of 1.8 pt on a 2x screen is 3.6 px, and a visible edge cannot fall between pixels.

What happens: the view's edge lands on a fractional position, and the system smooths it (antialiasing) by blending the color with neighboring pixels. The view looks blurry or "soapy", and lines look fuzzy and of different thickness on different screens. The extra blending also loads the GPU: such layers require blending and perform worse.

How to avoid it: round coordinates and sizes to pixel boundaries, for example `round(value * scale) / scale` (`UIScreen.main.scale` or `traitCollection.displayScale`); for a thin line use `1 / scale`; make sure Auto Layout does not produce fractional values (for example, when dividing a width by an odd number). The simulator's debug options help find the problem: **Debug → Color Misaligned Images** and **Color Blended Layers**.
