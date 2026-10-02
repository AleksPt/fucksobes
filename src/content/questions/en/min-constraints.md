---
title: "What is the minimum number of constraints needed to define a UIView's position on the screen?"
category: uikit
order: 77
---

For an unambiguous layout, Auto Layout must know the view's position and size along both axes, so for each axis you need to define both the position and the size:

- in general, 4 constraints are needed: two horizontal (for example, `leading` and `width`) and two vertical (for example, `top` and `height`);
- if the view has an `intrinsicContentSize` (`UILabel`, `UIButton`, `UIImageView`), the size is determined by the content, and 2 constraints are enough: one for each axis, for example `top` and `leading`;
- if the view has its own size along only one axis, you still need two constraints on the other axis (position and size).

Constraints can also be of other kinds: `leading` and `trailing` together define both the position and the width. If there is not enough data or the constraints contradict each other, Auto Layout issues a warning about an ambiguous or conflicting layout.
