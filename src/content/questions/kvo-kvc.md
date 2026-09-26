---
title: "Что такое KVO и KVC? Для чего их используют?"
category: swift
order: 90
---

**KVC** (Key-Value Coding) — механизм доступа к свойствам объекта по строковому ключу, а не напрямую: `object.value(forKey: "name")` и `object.setValue(_, forKey:)`. Работает с наследниками `NSObject` и свойствами, доступными для Objective-C. Ключи можно составлять в пути (`"address.city"`).

**KVO** (Key-Value Observing) — механизм подписки на изменения свойства объекта. Чтобы он работал в Swift, класс должен наследоваться от `NSObject`, а наблюдаемое свойство — быть помечено `@objc dynamic`.

```swift
class Person: NSObject { @objc dynamic var name = "" }

let person = Person()
let token = person.observe(\.name, options: [.old, .new]) { _, change in
    print(change.oldValue ?? "", "→", change.newValue ?? "")
}
```

Токен подписки надо хранить: при его освобождении наблюдение прекращается. В Swift вместо строк используют `KeyPath`, что типобезопаснее. Механизм применяется в Cocoa-классах (например, `AVPlayer`, `UIScrollView.contentOffset`) и как основа привязок (bindings). Для нативных Swift-типов вместо него чаще выбирают `@Observable`, Combine (`@Published`) и `didSet`.
