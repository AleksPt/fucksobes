---
title: "Which is faster: Auto Layout or manual frame-based layout?"
category: uikit
order: 105
---

Frame-based layout is faster: positions are computed directly with arithmetic, without a solver. Auto Layout converts constraints into a system of linear equations and inequalities and solves it, and the cost grows with the number of constraints and the relationships between views (in the worst case noticeably faster than linearly).

But for a typical screen the difference is barely noticeable: Auto Layout is optimized (significantly sped up in iOS 12) and solves the problem in fractions of a millisecond. It provides flexibility: adapting to screen sizes, Dynamic Type, localization and RTL, content-based sizing, size classes.

In practice: use Auto Layout by default, and manual layout where performance is critical (thousands of elements, heavy cells in lists, custom containers and charts) and where the layout is simple. Decisions should be based on measurements in Instruments, not on gut feeling. The two can be combined: Auto Layout on the outside, and `layoutSubviews` with frames inside a cell or a custom view.
