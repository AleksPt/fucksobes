---
title: "Что такое NSLayoutAnchor?"
category: uikit
order: 155
---

`NSLayoutAnchor` — фабричный класс, который даёт удобный типобезопасный API для создания констрейнтов Auto Layout программно, вместо громоздкого `NSLayoutConstraint(item:attribute:relatedBy:toItem:attribute:multiplier:constant:)`.

У `NSLayoutAnchor` есть три специализированных подкласса, каждый отвечает за свою «ось» ограничений и не позволяет по ошибке связать несовместимые атрибуты (например, горизонтальный якорь с вертикальным компилятор не даст соединить):

- **`NSLayoutXAxisAnchor`** — горизонтальные ограничения: `leadingAnchor`, `trailingAnchor`, `centerXAnchor`;
- **`NSLayoutYAxisAnchor`** — вертикальные ограничения: `topAnchor`, `bottomAnchor`, `centerYAnchor`;
- **`NSLayoutDimension`** — размеры: `widthAnchor`, `heightAnchor`.

У каждой `UIView` (через `UILayoutGuide` — тоже) есть эти якоря как свойства. Констрейнт создают методом вроде `constraint(equalTo:)`, `constraint(greaterThanOrEqualTo:constant:)`, а активируют через `isActive = true` или `NSLayoutConstraint.activate([...])`.

```swift
NSLayoutConstraint.activate([
    subview.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
    subview.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
    subview.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
    subview.heightAnchor.constraint(equalToConstant: 44)
])
```

На практике сам класс `NSLayoutAnchor` напрямую почти не используют — работают с его подклассами через свойства-якоря, а сам он служит общим базовым типом, обеспечивающим единый API (`constraint(equalTo:)` и другие методы) для всех трёх осей. Не забывают выключить `translatesAutoresizingMaskIntoConstraints = false` у view, для которой задают констрейнты вручную, иначе автоматически сгенерированные констрейнты из `autoresizingMask` будут конфликтовать с добавленными.
