---
title: "Что такое size class? Какие они бывают? Для чего их используют?"
category: uikit
order: 85
---

Size class — абстрактная характеристика доступного места в окне приложения, отдельно для горизонтали и вертикали. У каждой оси два значения: `compact` (мало места) и `regular` (много места), плюс `unspecified`. Они собраны в `UITraitCollection` (`horizontalSizeClass`, `verticalSizeClass`), которую получает каждый view и view controller.

Комбинации:

- iPhone в портрете: ширина compact, высота regular;
- iPhone в ландшафте: высота compact, а ширина compact или regular (у больших моделей);
- iPad в полноэкранном режиме: regular по обеим осям, а в Split View или Slide Over окно может стать compact по ширине.

Size class используют, чтобы адаптировать интерфейс, не привязываясь к конкретному устройству: показать боковую панель на широком экране и стек на узком, изменить раскладку, шрифты и набор элементов. В Interface Builder для этого есть вариации ограничений под класс размера, а в коде — метод `traitCollectionDidChange(_:)` (в iOS 17+ `registerForTraitChanges`).
