---
title: "Why shouldn't you store large data in UserDefaults?"
category: data-storage
order: 4
---

`UserDefaults` is the app's preferences database: according to Apple's documentation, it is intended for non-secret configuration, its values are property list types (`Int`, `Bool`, `String`, `Date`, `Array`, `Dictionary`, and so on), and arbitrary objects must be archived into `Data` beforehand. The documentation advises preferring simple types over custom objects.

That is why large data (images, files, big collections) doesn't belong there: on a write `UserDefaults` immediately updates its in-memory copy and writes to disk asynchronously, so bulky values occupy memory while the object is alive. In addition, the system includes preferences databases in device backups, and they bloat them. Keep large data in files or in a database (Core Data, SwiftData, SQLite), and leave only small settings in `UserDefaults`.
