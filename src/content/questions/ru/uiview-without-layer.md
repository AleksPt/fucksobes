---
title: "Может ли UIView не иметь слоя?"
category: uikit
order: 137
---

Нет. Каждая `UIView` всегда опирается на `CALayer`: свойство `layer` неопциональное, создаётся вместе с view, а сама view лишь его «менеджер». Отрисовку, анимации и композитинг выполняет слой, а view добавляет обработку событий, иерархию, раскладку и доступ к API UIKit.

Тип слоя можно заменить, переопределив `layerClass`:

```swift
final class GradientView: UIView {
    override class var layerClass: AnyClass { CAGradientLayer.self }
    var gradient: CAGradientLayer { layer as! CAGradientLayer }
}
```

Обратное неверно: слой может существовать без view (например, `CAShapeLayer`, добавленный через `layer.addSublayer`), и слои дешевле view, так как не обрабатывают события и не участвуют в responder chain. SwiftUI-представления `UIView` не являются, но при отображении на UIKit-платформах в итоге тоже дают слои.
