---
title: "What is Core Graphics for? What tasks does it handle?"
category: uikit
order: 136
---

Core Graphics (Quartz 2D) is a low-level 2D drawing framework: it renders vector and raster graphics into a context (`CGContext`) that is independent of the output device.

What it does:

- **drawing shapes and paths**: lines, curves, rectangles, ellipses (`CGPath`), fills and strokes, gradients, shadows;
- **colors and color spaces**, working with transparency and blend modes;
- **images**: creating and transforming `CGImage`, masks, clipping;
- **geometry and transforms**: `CGPoint`, `CGSize`, `CGRect`, `CGAffineTransform`;
- **PDF**: creating and rendering documents;
- drawing text and output to contexts: the screen, a bitmap, a PDF.

It is used for custom drawing inside `draw(_:)`, generating images (`UIGraphicsImageRenderer`), and drawing graphs and charts. Core Graphics draws on the CPU into a bitmap, which is then composited by Core Animation on the GPU. Therefore frequent redrawing through Core Graphics is more expensive than animating layer properties.
