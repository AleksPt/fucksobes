---
title: "Когда стоит использовать updateViewConstraints()?"
category: uikit
order: 94
---

`updateViewConstraints()` — метод `UIViewController`, который система вызывает перед раскладкой, когда констрейнты контроллера нужно обновить (после `setNeedsUpdateConstraints()` у его view). Аналог у view — `updateConstraints()`.

Его переопределяют, чтобы собрать все изменения констрейнтов в одном месте и применить пакетно: включить или выключить набор констрейнтов в зависимости от состояния (например, портрет и ландшафт), создать их лениво один раз. Обязательно вызывают `super.updateViewConstraints()` в конце.

```swift
override func updateViewConstraints() {
    if !didSetupConstraints {
        NSLayoutConstraint.activate([...])
        didSetupConstraints = true
    }
    compactConstraint.isActive = isCompact
    super.updateViewConstraints()
}
```

Перезапуск запрашивают вызовом `setNeedsUpdateConstraints()`, а не самого метода. Сегодня используют редко: чаще констрейнты создают в `viewDidLoad()`, а меняют напрямую через `isActive` и `constant`. Метод полезен, когда обновлений много и их нужно объединить в одну пачку.
