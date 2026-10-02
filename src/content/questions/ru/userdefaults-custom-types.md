---
title: "Как сохранить кастомные типы в UserDefaults?"
category: data-storage
order: 27
---

`UserDefaults` хранит только типы property list: `String`, `Int`/`Double`/`Bool`, `Date`, `Data`, `URL`, а также `Array` и `Dictionary` из них. Свой тип поэтому нужно превратить в `Data` и обратно. Самый простой способ — `Codable` и `JSONEncoder`:

```swift
struct User: Codable { let name: String; let age: Int }

let defaults = UserDefaults.standard

// запись
let user = User(name: "Swift Guide", age: 22)
if let data = try? JSONEncoder().encode(user) {
    defaults.set(data, forKey: "user")
}

// чтение
if let data = defaults.data(forKey: "user"),
   let saved = try? JSONDecoder().decode(User.self, from: data) {
    print(saved.name)
}
```

Альтернативы: `PropertyListEncoder`, архивация `NSKeyedArchiver` с `NSSecureCoding` для типов на Objective-C, а для перечислений с raw value — сохранять сам `rawValue` (в SwiftUI это делает `@AppStorage`). `UserDefaults` подходит для небольших настроек: большие объёмы и структурированные данные хранят в файлах или базе, а секреты — в Keychain.
