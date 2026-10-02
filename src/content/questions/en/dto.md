---
title: "What is a DTO?"
category: architecture
order: 59
---

A DTO (Data Transfer Object) is a simple object for passing data between layers or systems, usually between the server and the app. It contains only fields (and, as a rule, `Codable` conformance), with no business logic.

```swift
struct UserDTO: Decodable {
    let id: Int
    let full_name: String
    let avatar_url: String?
}

struct User {                  // domain model
    let id: Int
    let name: String
    let avatar: URL?
    init(dto: UserDTO) { ... }  // mapping
}
```

Why it is needed: the format of the server response (field names, optionals, nesting) is separated from the app's domain models. A change to the API affects only the DTO and the mapper, not all the code. In the app, data usually goes through the chain `DTO (network)` → `Domain model` → `ViewModel`. Cons: extra code and mappers, and duplicated fields, so small apps sometimes use a single model for all layers.
