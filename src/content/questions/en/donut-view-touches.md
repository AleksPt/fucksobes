---
title: "We have a custom view shaped like a donut: a circle with the middle cut out. How do we make taps on that center not go through?"
category: uikit
order: 58
---

Override `point(inside:with:)` to exclude the center from the responder chain: return `false` for points in the center, and then the view will not handle the tap.
