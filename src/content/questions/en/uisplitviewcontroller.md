---
title: "What is UISplitViewController? What is it used for and how is it implemented? What recent changes has it received?"
category: uikit
order: 88
---

`UISplitViewController` is a container that shows several view controllers side by side, usually "list and details" (for example, Mail or Notes). It suits iPad and large screens and adapts to the window size by itself: in a narrow window the columns collapse into stack navigation.

Since iOS 14 there is a modern column-based API: you create the controller with `init(style: .doubleColumn)` or `.tripleColumn` and assign controllers to columns with `setViewController(_:for:)` (`.primary`, `.supplementary`, `.secondary`, and also `.compact`). The `.compact` column is shown when the horizontal size class is compact (for example, on iPhone), which lets you build a separate interface for a narrow screen. The display mode is controlled by `preferredDisplayMode` and `preferredSplitBehavior` (`tile`, `overlay`, `displace`). The old API (`viewControllers`, `masterViewController`) is considered deprecated.
