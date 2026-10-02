---
title: "What is a size class? What kinds are there? What are they used for?"
category: uikit
order: 85
---

A size class is an abstract characterization of the space available in the app's window, separately for the horizontal and vertical axes. Each axis has two values: `compact` (little space) and `regular` (a lot of space), plus `unspecified`. They are gathered in a `UITraitCollection` (`horizontalSizeClass`, `verticalSizeClass`), which every view and view controller receives.

Combinations:

- iPhone in portrait: width compact, height regular;
- iPhone in landscape: height compact, and width compact or regular (on larger models);
- iPad in full screen: regular on both axes, while in Split View or Slide Over the window may become compact in width.

Size classes are used to adapt the interface without tying it to a specific device: show a sidebar on a wide screen and a stack on a narrow one, change the layout, fonts and set of elements. In Interface Builder there are constraint variations per size class, and in code the `traitCollectionDidChange(_:)` method (in iOS 17+, `registerForTraitChanges`).
