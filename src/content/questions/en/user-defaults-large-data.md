---
title: "Why shouldn't you store large data in UserDefaults?"
category: data-storage
order: 4
---

`UserDefaults` is the app's preferences database: according to Apple's documentation, it is intended for non-secret configuration, its values are property list types (`Int`, `Bool`, `String`, `Date`, `Array`, `Dictionary`, and so on), and arbitrary objects must be archived into `Data` beforehand. The documentation advises preferring simple types over custom objects.

`UserDefaults` values are kept in the preferences database: on a write the object updates the in-memory data immediately and writes to disk asynchronously, and persistent databases are included in device backups.
