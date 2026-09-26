---
title: "Как построить UI в коде? Какие преимущества и недостатки у такого подхода?"
category: uikit
order: 86
---

Все действия Interface Builder выполняют вручную: создают view, настраивают свойства, добавляют в иерархию (`addSubview`), отключают автоматическое преобразование маски (`translatesAutoresizingMaskIntoConstraints = false`) и задают ограничения через якоря.

```swift
let label = UILabel()
label.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(label)
NSLayoutConstraint.activate([
    label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    label.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
])
```

Плюсы: нет проблем с конфликтами слияния в XML, код легко ревьюить и переиспользовать, нет строковых идентификаторов и связей `IBOutlet`, проще собирать интерфейс из компонентов. Минусы: много шаблонного кода, нет визуального превью (его частично заменяют SwiftUI-превью и сторонние DSL), а ошибки в ограничениях видны только при запуске. Для сокращения кода используют помощники для якорей и библиотеки вроде SnapKit.
