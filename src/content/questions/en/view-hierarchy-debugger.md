---
title: "What is the View Hierarchy Debugger?"
category: tooling
order: 21
---

The View Hierarchy Debugger is an Xcode tool that "freezes" the running app and shows its interface as a three-dimensional layout of layers: the view hierarchy, along with the views' positions and sizes. It is invoked with the **Debug View Hierarchy** button on the debug bar while the app is running.

It lets you:

- see how views are nested and find elements that overlap others or extend beyond their bounds;
- inspect the `frame`, Auto Layout constraints, transparency and hidden views;
- find conflicting or ambiguous constraints (they are marked with warnings);
- select an element and get its address in order to call it from the LLDB console.

It is useful when the layout behaves unexpectedly: an element isn't visible, isn't where it should be, or doesn't respond to touches. For SwiftUI the tool is less informative, because it shows the resulting hierarchy of UIKit views rather than SwiftUI structures.
