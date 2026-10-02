---
title: "Как работает intrinsicContentSize и когда его переопределяют?"
category: uikit
order: 95
---

`intrinsicContentSize` — естественный размер view, который она сама знает по своему содержимому: для `UILabel` это размер текста, для `UIButton` — заголовка и отступов, для `UIImageView` — размер картинки. Если размер по какой-то оси неизвестен, возвращается `UIView.noIntrinsicMetric`.

Auto Layout использует его так: если у view заданы позиция, но не размер, недостающие констрейнты ширины и высоты создаются из `intrinsicContentSize` с помощью приоритетов `contentHuggingPriority` (не растягиваться) и `contentCompressionResistancePriority` (не сжиматься).

Переопределяют его в кастомных view, размер которых определяется содержимым (например, тег-облако, кнопка с иконкой):

```swift
override var intrinsicContentSize: CGSize {
    CGSize(width: label.intrinsicContentSize.width + 24, height: 44)
}
```

При изменении содержимого вызывают `invalidateIntrinsicContentSize()`, чтобы раскладка пересчиталась.
