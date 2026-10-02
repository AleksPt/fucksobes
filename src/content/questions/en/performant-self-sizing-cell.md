---
title: "How do you make a performant self-sizing cell?"
category: uikit
order: 118
---

A self-sizing cell determines its height from its content. For `UITableView` this is `rowHeight = UITableView.automaticDimension` together with `estimatedRowHeight`; for `UICollectionView`, estimated sizes in the layout. The `contentView` content is pinned with constraints from top to bottom without gaps, so that the height is computed unambiguously.

How to make it fast:

- provide an **accurate estimate** of the height: then the scroll indicator size and offsets don't jump, and off-screen cells are not recalculated needlessly;
- **cache** the calculated heights by data identifier and invalidate the cache when the content or the width changes;
- simplify the cell: fewer nested stacks and constraints, no "heavy" views; multiline text is the most expensive;
- where needed, compute the height manually (`sizeThatFits`, `boundingRect` for text) and do it **ahead of time**, in the background, rather than at display time;
- call `systemLayoutSizeFitting` on a single "reference" cell rather than on every cell if the layout is the same;
- in newer iOS versions it is useful to disable unnecessary size invalidations (`selfSizingInvalidation` on `UICollectionViewCell`, iOS 16).
