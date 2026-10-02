---
title: "Frame — это вычисляемое свойство? Что влияет на его расчёт?"
category: uikit
order: 149
---

Да. У `UIView` `frame` не хранится как отдельное значение: это вычисляемое свойство, которое строится из свойств слоя (`CALayer`):

- **`position`** (в `UIView` это `center`) — положение якорной точки в координатах superview;
- **`bounds.size`** — размер view;
- **`anchorPoint`** — точка внутри слоя, к которой привязана `position` (по умолчанию центр);
- **`transform`** — аффинное преобразование (поворот, масштаб).

Если transform единичный, `frame.origin` получается из `position` и `anchorPoint`, а `frame.size` равен `bounds.size`. При установке `frame` пересчитываются `position` и `bounds.size`.

Если у view есть transform (например, поворот), `frame` — это **минимальный прямоугольник, охватывающий преобразованную view** в координатах superview. Поэтому после поворота на 45° `frame` становится больше `bounds`, а `bounds` остаётся прежним. Задавать `frame` при неединичном transform нельзя: результат не определён, изменять размер и положение нужно через `bounds` и `center`.

```swift
let view = UIView(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
view.transform = CGAffineTransform(rotationAngle: .pi / 4)

print(view.bounds) // (0, 0, 100, 100) — не изменился
print(view.frame)  // примерно (-20.7, -20.7, 141.4, 141.4) — охватывающий прямоугольник
```
