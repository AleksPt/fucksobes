---
title: "Пользователь нажал на вьюшку, как она обработает нажатие?"
category: uikit
order: 55
---

UIKit сначала определяет, какой view получит касание: `hitTest(_:with:)` обходит иерархию и ищет самый глубокий subview, содержащий точку касания (пропуская скрытые view, view с отключённым `isUserInteractionEnabled` и с `alpha` меньше `0.01`). Этот view становится first responder для касания.

Дальше:

- gesture recognizers получают касания раньше самого view; если они не распознали жест, касания приходят во view;
- `UIControl` (например, кнопка) сам отслеживает касания и отправляет action своему target;
- если view не обработал касание, оно передаётся вверх по responder chain: superview, затем view controller (для корневого view), окно, `UIApplication`.
