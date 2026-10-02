---
title: "Как UIViewPropertyAnimator работает с анимациями Auto Layout?"
category: uikit
order: 112
---

Констрейнты сами по себе не анимируются: изменение `constant` или `isActive` только помечает раскладку как устаревшую. Чтобы получить анимацию, нужно заставить раскладку выполниться внутри блока анимации, вызвав `layoutIfNeeded()` у общего родителя.

```swift
heightConstraint.constant = 200          // 1. меняем констрейнты до анимации

let animator = UIViewPropertyAnimator(duration: 0.3, curve: .easeInOut) {
    self.view.layoutIfNeeded()           // 2. раскладка выполняется внутри блока — и анимируется
}
animator.startAnimation()
```

Изменение констрейнтов делают перед созданием блока, а `layoutIfNeeded()` вызывают у view, которая содержит все изменяемые подвью (обычно у `view` контроллера), иначе анимироваться будет только часть иерархии. Аниматор поддерживает паузу, перемотку (`fractionComplete`), реверс и прерывание, что удобно для интерактивных переходов. Вариант со старым API — `UIView.animate(withDuration:)` с таким же `layoutIfNeeded()` внутри.
