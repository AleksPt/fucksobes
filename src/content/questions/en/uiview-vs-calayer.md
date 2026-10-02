---
title: "What is CALayer and how does it differ from UIView?"
category: uikit
order: 4
---

**`UIView`** is a visual interface element: a rectangular area on the screen with its own coordinate system. It is responsible for building the interface and handling user events (for example, taps). It inherits from `UIResponder`, which defines the interface for handling and delivering events.

**`CALayer`** is a lower-level object that manages the display of content (graphics, animation, gradients). It inherits directly from `NSObject` and does not handle user input.

Inside every `UIView` there is a `CALayer` that is responsible for drawing and displaying the content: the size and style of a `UIView` are provided by its underlying layer.
