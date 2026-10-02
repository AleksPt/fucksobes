---
title: "How is rotating a view implemented in UIKit?"
category: uikit
order: 16
---

Through affine transforms (`CGAffineTransform`):

```swift
view.transform = CGAffineTransform(rotationAngle: CGFloat.pi / 4)
```
