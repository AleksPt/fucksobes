---
title: "Как реализовать парсинг JSON в iOS? Что такое Encodable/Decodable?"
category: networking
order: 7
---

`Encodable` позволяет типу превратить себя во внешнее представление (например, JSON), `Decodable` — создать себя из него. `Codable` — псевдоним для `Encodable & Decodable`. Для структур и перечислений, все свойства которых сами кодируемы, компилятор синтезирует реализацию автоматически.

```swift
struct User: Codable {
    let name: String
    let lastName: String
}

let user = try JSONDecoder().decode(User.self, from: data)
let data = try JSONEncoder().encode(user)
```

Если ключи JSON не совпадают с именами свойств, задают перечисление `CodingKeys` или настраивают `keyDecodingStrategy` (например, `.convertFromSnakeCase`). Для нестандартных форматов дат используют `dateDecodingStrategy`. При необходимости `init(from:)` и `encode(to:)` реализуют вручную. Ошибки разбора выбрасываются как `DecodingError`.
