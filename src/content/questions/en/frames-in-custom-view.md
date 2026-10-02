---
title: "How do you lay out with frames inside a custom UIView?"
category: uikit
order: 100
---

Frame-based layout is done in `layoutSubviews()`: the system calls it when the view's size has changed or a layout has been requested. In it, you compute subview positions from the current `bounds` rather than from hard-coded numbers.

```swift
override func layoutSubviews() {
    super.layoutSubviews()
    let insets = safeAreaInsets
    let content = bounds.inset(by: insets)
    icon.frame = CGRect(x: content.minX + 16, y: content.midY - 12, width: 24, height: 24)
    title.frame = CGRect(x: icon.frame.maxX + 8, y: content.minY,
                         width: content.width - 48, height: content.height)
}
```

Rules: take `safeAreaInsets` (and `layoutMargins`) and the writing direction (`effectiveUserInterfaceLayoutDirection`) into account for RTL; don't create views or do heavy computation inside the method; request a recalculation with `setNeedsLayout()` instead of calling `layoutSubviews()` directly. For height based on content, implement `sizeThatFits(_:)` so that the parent can find out the size.
