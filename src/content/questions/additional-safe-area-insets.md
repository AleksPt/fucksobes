---
title: "Чем additionalSafeAreaInsets отличается от contentInsetAdjustmentBehavior?"
category: uikit
order: 108
---

Оба свойства связаны с безопасной областью, но относятся к разным вещам.

- `additionalSafeAreaInsets` — свойство `UIViewController`. Оно расширяет безопасную область для view контроллера и его дочерних контроллеров сверх системных отступов. Так родительский контейнер сообщает детям о собственных перекрывающих элементах, например, о кастомной нижней панели: `child.additionalSafeAreaInsets = UIEdgeInsets(top: 0, left: 0, bottom: 60, right: 0)`.
- `contentInsetAdjustmentBehavior` — свойство `UIScrollView`. Оно определяет, как безопасная область влияет на `adjustedContentInset` прокручиваемого контента: `.automatic`, `.scrollableAxes`, `.never`, `.always`. То есть оно относится только к отступам содержимого scroll view и не меняет саму безопасную область.

Итог: первое меняет safe area (влияет на все view, зависящие от неё), второе решает, как содержимое одной scroll view использует уже существующую safe area.
