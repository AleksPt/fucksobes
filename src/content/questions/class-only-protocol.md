---
title: "Как ограничить протокол только классами (protocol: AnyObject)?"
category: swift
order: 130
---

Чтобы протоколу могли соответствовать только классы, а не структуры и перечисления, его наследуют от `AnyObject`:

```swift
protocol Delegate: AnyObject {
    func didFinish()
}

class ViewController: Delegate { func didFinish() {} }   // корректно
struct Model: Delegate { func didFinish() {} }           // ошибка
```

Раньше для этого писали `protocol P: class`; эта форма считается устаревшей в пользу `AnyObject`.

Зачем нужно: для ссылочной семантики и слабых ссылок. Свойство `weak var delegate: Delegate?` допустимо только для типа, который точно является классом, поэтому делегатов объявляют как class-only, чтобы не получить retain cycle. Кроме того, экземпляры такого протокола можно сравнивать по ссылке (`===`).
