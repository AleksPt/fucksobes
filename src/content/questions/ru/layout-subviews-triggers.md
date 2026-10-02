---
title: "Что запускает layoutSubviews?"
category: uikit
order: 138
---

`layoutSubviews()` вызывается системой, когда view требует пересчёта раскладки. Основные причины:

- изменение размера `bounds` view (при изменении `frame.size`, повороте устройства, смене режима окна, смене trait collection); изменение только `origin` раскладку не запускает;
- добавление или удаление subview (`addSubview`, `removeFromSuperview`);
- вызов `setNeedsLayout()` (раскладка выполнится на ближайшем проходе run loop) или `layoutIfNeeded()`, если раскладка была запрошена;
- изменение констрейнтов (`constant`, `isActive`, приоритета) и `intrinsicContentSize` у view, если раскладка идёт через Auto Layout;
- прокрутка `UIScrollView`: изменение `contentOffset` вызывает `layoutSubviews` самой scroll view (для ленивой подгрузки ячеек);
- начальный показ view и первое добавление в окно.

`layoutSubviews()` вызывают только система и `layoutIfNeeded()`: прямые вызовы недопустимы. Внутри метода нельзя изменять то, что снова запускает раскладку, иначе возможен цикл.
