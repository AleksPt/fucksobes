---
title: "What are contentHuggingPriority and contentCompressionResistancePriority?"
category: uikit
order: 79
---

These are priorities that Auto Layout uses for views with an `intrinsicContentSize` when the available space does not match the size of the content. They are set separately for the horizontal and vertical axes.

- `contentHuggingPriority` is how strongly a view resists being **stretched** beyond its content. A high value means the view prefers not to grow.
- `contentCompressionResistancePriority` is how strongly a view resists being **compressed** below its content. A high value means the view will not let itself be clipped.

Example: two `UILabel`s in one row, and there is room for only one of them in full. If the left label has a higher compression resistance, it keeps its size, while the right one is compressed or truncated. If there is extra space left over, the label with the lower hugging priority stretches.

```swift
label.setContentHuggingPriority(.defaultHigh, for: .horizontal)
label.setContentCompressionResistancePriority(.required, for: .horizontal)
```

Default values: hugging `250` (`defaultLow`), compression resistance `750` (`defaultHigh`).
