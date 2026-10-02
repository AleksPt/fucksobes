---
title: "Does every UIView inherit from UIControl? What is this class?"
category: uikit
order: 52
---

No. `UIView` is a concrete class, the base for any visible interface element, while `UIControl` is the base class specifically for controls such as `UIButton`, `UISlider`, `UISwitch` and `UISegmentedControl`; in other words, not every view is a control.

`UIControl` is not created directly; it is an extension point for your own controls. It provides the target-action mechanism (`addTarget(_:action:for:)`), states and events (`touchUpInside`, `valueChanged`), so instead of tracking touches by hand it is enough to write an action method.
