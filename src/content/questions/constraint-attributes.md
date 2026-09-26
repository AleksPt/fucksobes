---
title: "Назовите основные атрибуты constraint и что каждый из них означает"
category: uikit
order: 78
---

`NSLayoutConstraint` описывает уравнение `firstItem.firstAttribute relation secondItem.secondAttribute * multiplier + constant`:

- `firstItem` и `firstAttribute` — view (или layout guide) и его атрибут (`top`, `leading`, `width`, `centerX` и т. д.);
- `relation` — отношение: `equal`, `lessThanOrEqual`, `greaterThanOrEqual`;
- `secondItem` и `secondAttribute` — то, с чем сравниваем; может быть `nil`, если задаётся константа (например, фиксированная ширина);
- `multiplier` — множитель для второго атрибута (задаёт пропорции);
- `constant` — постоянное смещение;
- `priority` — приоритет от 1 до 1000; 1000 (`required`) — обязательное, остальные система может нарушить, если они конфликтуют;
- `isActive` — включено ли ограничение.

Свойства после создания только для чтения, кроме `constant`, `isActive` и `priority` (последний нельзя менять с и на `required` после активации). `multiplier` изменить нельзя: для этого ограничение пересоздают.
