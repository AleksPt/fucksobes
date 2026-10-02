---
title: "Зачем использовать UILayoutGuide, а не пустой UIView для вёрстки?"
category: uikit
order: 110
---

`UILayoutGuide` — невидимый прямоугольник, к которому можно привязывать констрейнты, но он не является view. Раньше для распределения пространства и центрирования групп элементов создавали пустые `UIView`-«распорки». Layout guide заменяет их без накладных расходов:

- не входит в иерархию view: не рисуется, не участвует в hit-testing и не создаёт слой Core Animation;
- занимает меньше памяти и легче для системы;
- не мешает касаниям и не добавляется в иерархию, поэтому она остаётся чище.

```swift
let guide = UILayoutGuide()
view.addLayoutGuide(guide)
NSLayoutConstraint.activate([
    guide.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    button.topAnchor.constraint(equalTo: guide.topAnchor),
])
```

Системные примеры: `safeAreaLayoutGuide`, `layoutMarginsGuide`, `readableContentGuide`, `keyboardLayoutGuide` (iOS 15+).
