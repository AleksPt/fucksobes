---
title: "How do you save custom types in UserDefaults?"
category: data-storage
order: 27
---

`UserDefaults` stores only property list types: `String`, `Int`/`Double`/`Bool`, `Date`, `Data`, `URL`, as well as `Array` and `Dictionary` of those. A custom type therefore has to be converted to `Data` and back. The simplest way is `Codable` and `JSONEncoder`:

```swift
struct User: Codable { let name: String; let age: Int }

let defaults = UserDefaults.standard

// write
let user = User(name: "Swift Guide", age: 22)
if let data = try? JSONEncoder().encode(user) {
    defaults.set(data, forKey: "user")
}

// read
if let data = defaults.data(forKey: "user"),
   let saved = try? JSONDecoder().decode(User.self, from: data) {
    print(saved.name)
}
```

Alternatives: `PropertyListEncoder`, archiving with `NSKeyedArchiver` and `NSSecureCoding` for Objective-C types, and for enums with a raw value, saving the `rawValue` itself (in SwiftUI `@AppStorage` does this). `UserDefaults` suits small settings: large volumes and structured data belong in files or a database, and secrets in the Keychain.
