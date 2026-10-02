---
title: "How does systemLayoutSizeFitting differ from intrinsicContentSize?"
category: uikit
order: 104
---

`intrinsicContentSize` is the view's "natural" size based on its own content, independent of external constraints: for `UILabel` it is the size of the text on one line (or up to `preferredMaxLayoutWidth`), for `UIImageView` the size of the image. It answers the question "how much space does this content need?"

`systemLayoutSizeFitting(_:)` is the result of running Auto Layout: it solves the constraints inside the view (including nested subviews and inner insets) and returns the size that would result for a given target size. It accounts not only for content but also for constraints, priorities and subviews.

Example: a container with an image, a caption and insets may have no `intrinsicContentSize` (`noIntrinsicMetric`), while `systemLayoutSizeFitting` will return the final size based on all constraints. The first is overridden in custom "leaf" views; the second is used to find out the height of a composite view or a cell.
