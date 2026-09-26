---
title: "Как определяется First Responder"
category: uikit
order: 50
---

UIKit назначает first responder в зависимости от типа события. Для касаний используется hit-testing: метод `hitTest(_:with:)` у `UIView` обходит иерархию view и ищет самый глубокий subview, содержащий точку касания, — он становится first responder для этого события. Некоторые события, например motion, сначала отправляются текущему first responder (`isFirstResponder`).

Объект также может стать first responder явно через `becomeFirstResponder()`, если его `canBecomeFirstResponder` возвращает `true`. Необработанное событие передаётся дальше по цепочке ответчиков: от view к superview, view controller, окну, `UIApplication`.

