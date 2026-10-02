---
title: "What is the render server?"
category: uikit
order: 139
---

The render server is a system process (on iOS, part of `backboardd`) that is responsible for compositing and drawing the interfaces of all apps to the screen, as well as for executing Core Animation animations. An app does not draw directly to the display: it prepares a layer tree and sends it to the render server, where the GPU assembles the final frame.

The flow:

1. **In the app process:** event handling, layout (`layoutSubviews`), preparing layer content (`draw(_:)`, image decoding), then committing the transaction.
2. **In the render server:** receiving the layer tree, executing animations, compositing on the GPU and outputting the frame in step with the screen refresh.

Important consequences follow: Core Animation animations keep playing even if the app's main thread is busy (they have already been handed to the render server), while extra GPU work (offscreen rendering, blending, large textures) slows down specifically the render server. A frame must be ready on time both in the app and in the render server.
