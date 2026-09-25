---
title: "Как реализуется поворот view в UIKit?"
category: uikit
order: 16
---

Через афинные преобразования (CGAffineTransform).

```swift
view.transform = CGAffineTransform(rotationAngle: CGFloat.pi / 4)

```
