---
title: "Что такое CGLayer?"
category: uikit
order: 127
---

`CGLayer` — объект Core Graphics (Quartz 2D) для повторной отрисовки: содержимое один раз рисуется в отдельный «слой» (`CGLayerCreateWithContext`), а потом многократно копируется в контекст с помощью `CGContextDrawLayerAtPoint`. Так экономили работу, если один и тот же рисунок нужно было нарисовать много раз (например, узор).

Важно не путать его с `CALayer` из Core Animation: `CGLayer` — низкоуровневый API для рисования в bitmap-контекст, у него нет иерархии, анимаций и композитинга, а `CALayer` — объект дерева слоёв, за которым стоит каждая `UIView`.

Сегодня `CGLayer` считается устаревшим приёмом: на практике для кеширования рисунка используют `UIGraphicsImageRenderer` и `UIImage`/`CGImage`, а для повторно используемых элементов — слои Core Animation (`CAShapeLayer`, `CAReplicatorLayer`).
