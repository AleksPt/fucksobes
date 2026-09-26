---
title: "Чем отличаются setNeedsLayout, layoutIfNeeded и layoutSubviews?"
category: uikit
order: 39
---

- **`setNeedsLayout`** — сообщает системе, что view нужно перерисовать асинхронно, в следующем цикле отрисовки (ставит флаг).
- **`layoutIfNeeded`** — если флаг установлен, немедленно запускает лейаут view и его сабвью, не дожидаясь следующего цикла отрисовки.
- **`layoutSubviews`** — вызывается системой для пересчёта размеров дочерних view.
