---
title: "А если поверх вьюшки повесим gesture recognizer? Как ты думаешь, кто из них первым получит событие?"
category: uikit
order: 63
---

Первым событие получит gesture recognizer. Окно доставляет касания gesture recognizer раньше, чем view, к которой он прикреплён (hit-tested view). Если recognizer не распознал жест, view получает всю последовательность касаний. Если распознал, оставшиеся касания для view отменяются (по умолчанию, `cancelsTouchesInView`).

Кроме того, gesture recognizer не участвует в responder chain view.

