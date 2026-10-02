---
title: "How does UILabel calculate its size from its content?"
category: uikit
order: 146
---

A label's size is determined by `intrinsicContentSize`: it is computed by the text subsystem (TextKit / Core Text) from the text, font, style (`NSAttributedString`), `numberOfLines`, `lineBreakMode` and the available width.

- For single-line text, the width equals the width of the text and the height equals the height of a line.
- For multiline text (`numberOfLines = 0`) a bounding width is needed: the label wraps the text by words and calculates the height. The width comes from constraints or from `preferredMaxLayoutWidth`. Auto Layout first determines the width and then asks for the height, so the width must be defined unambiguously (for example, with leading and trailing constraints).
- With manual layout, the size is provided by `sizeThatFits(_:)` (or `sizeToFit()`), as well as `NSString.boundingRect(with:options:context:)`.

The `contentHuggingPriority` and `contentCompressionResistancePriority` priorities determine whether the label will stretch or compress when the available space does not match the size of the text. The size also depends on Dynamic Type: when the text size changes, the layout must be updated.
