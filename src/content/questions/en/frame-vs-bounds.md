---
title: "What are frame and bounds? How do they differ?"
category: uikit
order: 9
---

- **Frame** is the size and position of a view relative to the coordinate system of its parent view (superview).
- **Bounds** is the size and position of a view relative to its own coordinate system.

If a view is transformed (for example, rotated or scaled), `frame` changes while `bounds` stays the same.
