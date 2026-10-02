---
title: "How does a point (pt) differ from a pixel (px)?"
category: uikit
order: 7
---

A **pixel** is a physical dot on the screen. A **point** is the logical unit in which UIKit measures coordinates and sizes.

The system converts points to pixels when rendering: pixels = points × `scale`. On Retina screens `scale` is 2.0 or 3.0, so one point is 4 or 9 pixels; on standard-resolution screens `scale` is 1.0.
