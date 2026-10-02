---
title: "What are Attributes in Core Data?"
category: data-storage
order: 30
---

An **attribute** is a property of an entity that stores a concrete value rather than a reference to another object. It is the equivalent of a table column in a relational database: each attribute of an entity describes one data type that will be stored for every instance of it.

The main attribute types:

- `String`, `Integer 16/32/64`, `Double`, `Float`, `Decimal`, `Boolean`;
- `Date`, `Binary Data`, `UUID`, `URI`;
- `Transformable` — for arbitrary objects outside the standard set (for example, `UIColor`), via `NSSecureUnarchiveFromDataTransformer`.

For an attribute you configure:

- **optionality** — whether the value may be absent (`Optional`), the equivalent of `NOT NULL` in SQL;
- **default value** (`Default Value`) — what is used if no value is set explicitly when the object is created;
- constraints (for example, a maximum string length) — checked during validation before saving.

```swift
final class User: NSManagedObject {
    @NSManaged var name: String       // an attribute of type String
    @NSManaged var age: Int16         // an attribute of type Integer 16
    @NSManaged var createdAt: Date?   // an optional attribute of type Date
}
```

Unlike a **relationship**, an attribute always stores the value of the object itself and does not point to another Core Data record.
