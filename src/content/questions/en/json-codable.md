---
title: "How do you parse JSON in iOS? What are Encodable and Decodable?"
category: networking
order: 7
---

`Encodable` lets a type convert itself into an external representation (for example, JSON), and `Decodable` lets it create itself from one. `Codable` is a typealias for `Encodable & Decodable`. For structs and enums whose properties are all codable themselves, the compiler synthesizes the implementation automatically.

```swift
struct User: Codable {
    let name: String
    let lastName: String
}

let user = try JSONDecoder().decode(User.self, from: data)
let data = try JSONEncoder().encode(user)
```

If the JSON keys do not match the property names, you define a `CodingKeys` enum or configure `keyDecodingStrategy` (for example, `.convertFromSnakeCase`). For non-standard date formats, use `dateDecodingStrategy`. When needed, you can implement `init(from:)` and `encode(to:)` by hand. Parsing errors are thrown as `DecodingError`.
