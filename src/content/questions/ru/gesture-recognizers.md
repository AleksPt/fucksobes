---
title: "Как работает UIGestureRecognizer?"
category: uikit
order: 62
---

`UIGestureRecognizer` отделяет распознавание жеста (tap, pan, pinch, swipe, long press и т. д.) от кода, который на него реагирует. Его привязывают к view через `addGestureRecognizer(_:)`, а при распознавании он отправляет action своему target. В responder chain распознаватель не участвует.

Как это работает:

- при касании создаётся `UITouch`, а `hitTest` находит самый глубокий view под пальцем; касания получают распознаватели, привязанные к этому view и его superview, причём раньше самого view;
- распознаватель работает как конечный автомат: дискретный жест переходит из `possible` в `recognized` или `failed`, непрерывный — `possible → began → changed → ended` (или `cancelled`/`failed`);
- пока жест не распознан, view получает касания как обычно (`touchesBegan`, `touchesMoved`, `touchesEnded`); когда жест распознан, оставшиеся касания у view отменяются и ему приходит `touchesCancelled` (при `cancelsTouchesInView = true`, это значение по умолчанию);
- конфликты между несколькими распознавателями разрешают через `UIGestureRecognizerDelegate` и `require(toFail:)`.
