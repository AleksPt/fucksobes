---
title: "How does intrinsicContentSize work and when do you override it?"
category: uikit
order: 95
---

`intrinsicContentSize` is a view's natural size, which it knows from its own content: for `UILabel` it is the size of the text, for `UIButton` the size of the title plus insets, for `UIImageView` the size of the image. If the size along some axis is unknown, `UIView.noIntrinsicMetric` is returned.

Auto Layout uses it like this: if a view has a position but no size, the missing width and height constraints are created from `intrinsicContentSize` using the `contentHuggingPriority` (don't stretch) and `contentCompressionResistancePriority` (don't compress) priorities.

You override it in custom views whose size is determined by their content (for example, a tag cloud, a button with an icon):

```swift
override var intrinsicContentSize: CGSize {
    CGSize(width: label.intrinsicContentSize.width + 24, height: 44)
}
```

When the content changes, call `invalidateIntrinsicContentSize()` so that the layout is recalculated.
