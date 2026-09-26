---
title: "Что такое Swift Package Manager (SPM)? Как его использовать?"
category: tooling
order: 27
---

Swift Package Manager — официальный менеджер зависимостей и система сборки Swift, встроенный в Xcode и командную строку (`swift build`, `swift test`). Пакет описывается манифестом `Package.swift` на самом Swift: там указываются продукты, цели (targets), зависимости и поддерживаемые платформы.

Использование в Xcode: **File → Add Package Dependencies…**, ввести URL репозитория, выбрать правило версии (`Up to Next Major`, точная версия, ветка, коммит) и цели, к которым подключить пакет. Версии фиксируются в `Package.resolved`.

Через манифест зависимости добавляют так:

```swift
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0")
],
targets: [
    .target(name: "App", dependencies: ["Alamofire"])
]
```

Пакеты можно создавать и локально, чтобы разбить проект на модули, — это удобно для модульной архитектуры. Поддерживает бинарные цели (XCFramework), ресурсы, плагины и мультиплатформенность.
