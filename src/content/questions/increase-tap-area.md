---
title: "Как увеличить область нажатия UIView?"
category: uikit
order: 133
---

Область нажатия определяет метод `point(inside:with:)`: он говорит, попадает ли точка в view. Чтобы расширить её за границы `bounds`, метод переопределяют:

```swift
final class BigTapButton: UIButton {
    override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        let area = bounds.insetBy(dx: -12, dy: -12)   // отрицательный inset расширяет область
        return area.contains(point)
    }
}
```

Расширенная область работает, только если родитель не обрезает касания: `hitTest` родителя должен дойти до этой view (например, если родитель имеет `clipsToBounds` и точка вне его границ, касание не дойдёт). Есть и другие способы: увеличить саму view (прозрачная подложка с нужными отступами), использовать `UIButton` с конфигурацией и `contentInsets`, добавить прозрачную кнопку большего размера поверх иконки или переопределить `hitTest(_:with:)`.

Рекомендация Apple по минимальному размеру области нажатия — 44×44 pt.
