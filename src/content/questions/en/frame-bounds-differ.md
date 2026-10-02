---
title: "In what case will bounds differ from frame?"
category: uikit
order: 11
---

- If a **`transform`** is applied to the view (rotation, scale, for example via `CGAffineTransform`): `bounds` stays the same, while the value of `frame` becomes undefined according to the documentation and should not be used.
- If **`bounds.origin`** is changed: `frame` stays the same, while the content shifts inside the view. This is how scrolling works: `UIScrollView` changes the origin of its bounds (`contentOffset`).
