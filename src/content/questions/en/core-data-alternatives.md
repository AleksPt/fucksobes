---
title: "What alternatives to Core Data do you know, and what are their pros and cons?"
category: data-storage
order: 19
---

- **SwiftData** — Apple's modern framework built on top of Core Data; models are declared with macros (`@Model`) and integrate with SwiftUI. Pros: minimal code, native Swift. Cons: requires iOS 17+, younger and less flexible.
- **Realm** — a third-party object database. Pros: fast, convenient API, live objects and change notifications. Cons: an external dependency, threading restrictions, slowed development of the product, Atlas Device Sync has been deprecated.
- **SQLite** directly, as well as the **GRDB** and **SQLite.swift** wrappers. Pros: full control over the schema and queries, excellent performance, portability. Cons: more manual work (SQL, migrations, relationships).
- **Files and `Codable`** (JSON or plist). Pros: simple for small amounts of data. Cons: no queries or relationships, the data is read in full.
- **UserDefaults and Keychain** — for settings and secrets, but not for large data sets.

The choice depends on the minimum iOS version, the amount of data, and whether you need relationships and complex queries.
