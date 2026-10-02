---
title: "If a collection/table stutters while scrolling, what do you do and where do you look?"
category: uikit
order: 67
---

Look in the Xcode profiler at how to optimize the cells. Possibly abandon Auto Layout; check shadows, cell reuse and heavy images (a cache? pagination?).
