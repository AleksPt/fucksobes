---
title: "Какие методы UIView участвуют в процессе лейаута?"
category: uikit
order: 37
---

`setNeedsLayout()`, `layoutIfNeeded()`, `layoutSubviews()`

Раскладка выполняется в три этапа за проход цикла обработки событий:

1. **Обновление констрейнтов** (`updateConstraints`, если запрошено `setNeedsUpdateConstraints()`): снизу вверх по иерархии обновляются констрейнты.
2. **Раскладка** (`layoutSubviews`): сверху вниз рассчитываются и выставляются `frame` подвью. Её запрашивает `setNeedsLayout()` (отложенно, на следующем проходе), а `layoutIfNeeded()` выполняет её сразу, если она требуется. Метод `layoutSubviews()` напрямую не вызывают.
3. **Отрисовка** (`draw(_:)`, если запрошена через `setNeedsDisplay()`).
