---
title: "What is the overhead of Auto Layout with 1000+ subviews, and how can it be reduced?"
category: uikit
order: 117
---

The cost of Auto Layout grows with the number of constraints and the relationships between views: the engine solves a system of equations, and with thousands of subviews layout can take tens of milliseconds and cause dropped frames. This shows up as FPS drops in Instruments (Time Profiler, the SwiftUI/Core Animation template) and as a high share of time spent in `layoutSubviews` and `NSISEngine`.

Ways to optimize:

- **reduce the number of views and constraints**: remove unnecessary nesting (deep `UIStackView` hierarchies), replace a set of views with a single custom view that draws its content itself (`draw(_:)` or layers);
- **use manual frame-based layout** for simple, high-volume elements (cells, charts);
- **don't recreate constraints** on every update; change `constant`/`isActive` instead, and group changes and activate them in a batch;
- **cache computed sizes** (cell heights) and provide accurate estimated values;
- split the layout so that changes affect only a small part of the hierarchy;
- move calculations off the main thread where possible.
