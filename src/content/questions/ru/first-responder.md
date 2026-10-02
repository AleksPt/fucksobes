---
title: "Как определяется First Responder"
category: uikit
order: 50
---

UIKit выбирает получателя события по его типу. Для касаний используется hit-testing: метод `hitTest(_:with:)` у `UIView` обходит иерархию view и ищет самый глубокий subview, содержащий точку касания, — именно он получает касание. Это не то же самое, что first responder (`isFirstResponder`): касание first responder не назначает. First responder — отдельное понятие: ему сначала отправляются, например, события клавиатуры, motion-события и action с `target = nil`.

Объект становится first responder явно через `becomeFirstResponder()`, если его `canBecomeFirstResponder` возвращает `true`. Необработанное событие передаётся дальше по цепочке ответчиков: от view к superview, view controller, окну, `UIApplication`.
