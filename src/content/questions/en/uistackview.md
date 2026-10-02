---
title: "What is UIStackView? What are its advantages and disadvantages?"
category: uikit
order: 80
---

`UIStackView` is a container that lays out nested views (`arrangedSubviews`) in a row or a column on its own and creates Auto Layout constraints for them. Its behavior is controlled by the properties `axis` (horizontal or vertical), `distribution`, `alignment` and `spacing`. Stack views can be nested inside one another, and hiding an `arrangedSubview` (`isHidden = true`) automatically redistributes the space.

Pros: fewer manual constraints, simple layout of forms and lists of elements, convenient hiding/showing of elements with animation.

Cons: `UIStackView` is an "invisible" container with no drawing of its own (for a background you put it inside a view), nesting grows quickly for complex layouts, and an excessive number of nested stacks complicates the layout and may affect performance; in addition, it is not easy to set special gaps between individual elements (there is `setCustomSpacing(_:after:)` for that).
