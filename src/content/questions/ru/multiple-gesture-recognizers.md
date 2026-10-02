---
title: "А что, если у меня там больше одного жестер-рекогнайзера? Как мне это сделать так, чтобы они не конфликтовали?"
category: uikit
order: 64
---

По умолчанию UIKit распознаёт на одной view только один жест за раз. Порядком распознавания управляют через делегат `UIGestureRecognizerDelegate`; для любой пары конфликтующих recognizer делегат нужен только одному из них.

- `gestureRecognizer(_:shouldRequireFailureOf:)` и `gestureRecognizer(_:shouldBeRequiredToFailBy:)` задают, что один жест должен «провалиться» раньше другого. Например, `pan` не сработает, пока не провалится `swipe`, а одиночный tap ждёт провала двойного.
- `gestureRecognizer(_:shouldRecognizeSimultaneouslyWith:)` разрешает распознавать жесты одновременно, если вернуть `true`.

