---
title: "How does leading differ from left?"
category: uikit
order: 129
---

`left` and `right` are absolute sides: left and right regardless of language. `leading` and `trailing` are sides that depend on the writing direction: for left-to-right languages (Russian, English) `leading` is the left side and `trailing` the right side, while for right-to-left languages (Arabic, Hebrew) it is the opposite.

In Auto Layout you should use `leading` and `trailing` (`leadingAnchor`, `NSLayoutConstraint.Attribute.leading`); then the interface is mirrored automatically in RTL locales: insets, icons and text placement switch sides. `left` and `right` are appropriate where the side is fixed by design (for example, a physical placement of an element that does not depend on the language).

For manual frame-based layout, you can find out the direction through `effectiveUserInterfaceLayoutDirection` or `semanticContentAttribute`.
