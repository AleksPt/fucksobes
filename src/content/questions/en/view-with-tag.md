---
title: "What is viewWithTag()?"
category: uikit
order: 134
---

Every `UIView` has an integer `tag` property (0 by default). The `viewWithTag(_:)` method searches among the view itself and all its nested subviews (recursively, depth-first) for the first view with the given tag and returns it (or `nil`).

```swift
label.tag = 100
view.addSubview(label)
let found = view.viewWithTag(100) as? UILabel
```

In the past this was how you got access to elements, for example cells created from Interface Builder. Downsides: tags are "magic numbers", it is easy to get conflicting values, the hierarchy search runs every time, there is no type safety (a cast is needed), and the code breaks when the layout changes. Tag 0 matches the default value, so it must not be used.

Instead of tags, it is better to use an `IBOutlet`, references in properties, an `accessibilityIdentifier` for UI tests, or your own view types.
