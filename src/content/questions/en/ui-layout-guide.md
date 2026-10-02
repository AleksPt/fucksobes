---
title: "Why use UILayoutGuide rather than an empty UIView for layout?"
category: uikit
order: 110
---

`UILayoutGuide` is an invisible rectangle that constraints can be attached to, but it is not a view. In the past, empty `UIView` "spacers" were created to distribute space and to center groups of elements. A layout guide replaces them with no overhead:

- it is not part of the view hierarchy: it is not drawn, does not take part in hit-testing and does not create a Core Animation layer;
- it takes less memory and is lighter for the system;
- it does not interfere with touches and is not added to the hierarchy, so the hierarchy stays cleaner.

```swift
let guide = UILayoutGuide()
view.addLayoutGuide(guide)
NSLayoutConstraint.activate([
    guide.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    button.topAnchor.constraint(equalTo: guide.topAnchor),
])
```

System examples: `safeAreaLayoutGuide`, `layoutMarginsGuide`, `readableContentGuide`, `keyboardLayoutGuide` (iOS 15+).
