---
title: "What is Core Data? When and what is it used for?"
category: data-storage
order: 18
---

Core Data is Apple's framework for managing a graph of model objects and persisting them. It is not a database as such: it is a layer over a store (SQLite by default) that takes care of creating and modifying objects, relationships between them, validation, undoing changes, and loading on demand.

It is used when an app needs to store structured data with relationships between entities, search and sort it (predicates and `NSFetchRequest`), work with large data sets without loading them into memory entirely, and migrate the schema between versions. For a handful of settings `UserDefaults` is enough, and secrets belong in the Keychain. Core Data integrates with `NSFetchedResultsController` and with iCloud sync through `NSPersistentCloudKitContainer`.
