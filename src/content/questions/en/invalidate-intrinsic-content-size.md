---
title: "When do you need to call invalidateIntrinsicContentSize()?"
category: uikit
order: 111
---

`invalidateIntrinsicContentSize()` tells Auto Layout that the view's natural size has changed and must be requested again, after which the layout is recalculated.

You call it in custom views that override `intrinsicContentSize`, every time something that size depends on changes: text, an image, a set of inner elements, insets.

```swift
final class TagView: UIView {
    var title: String = "" {
        didSet { invalidateIntrinsicContentSize() }
    }
    override var intrinsicContentSize: CGSize { ... }
}
```

For standard elements (`UILabel`, `UIButton`, `UIImageView`) you don't need to call it: they do so themselves when the text or image changes. The method only marks the size as outdated, so the actual recalculation happens on the next layout pass; to apply it immediately, call `layoutIfNeeded()`.
