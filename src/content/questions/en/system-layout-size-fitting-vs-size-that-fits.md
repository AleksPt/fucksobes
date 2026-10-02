---
title: "How do systemLayoutSizeFitting and sizeThatFits differ?"
category: uikit
order: 97
---

Both methods return a view's size, but they compute it differently.

- `systemLayoutSizeFitting(_:)` runs the Auto Layout engine: it solves the constraints inside the view and returns the size that fits them for the given target size. For the minimum size you pass `UIView.layoutFittingCompressedSize`, for the maximum `layoutFittingExpandedSize`; there is an overload with per-axis priorities. The method does not need to be overridden.
- `sizeThatFits(_:)` is a manual calculation method: it returns the size the view would prefer to have under the given constraints, and by default simply returns the current `bounds.size`. It is overridden in views whose layout is done manually (`layoutSubviews`), and it does not use constraints.

`UILabel`, `UIButton` and other standard elements implement `sizeThatFits`, so for them it gives a content-based size. For Auto Layout views, use `systemLayoutSizeFitting`, for example to compute a cell's height.
