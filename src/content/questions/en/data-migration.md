---
title: "What is a database migration?"
category: data-storage
order: 16
---

A migration brings an existing database and its data in line with a new version of the schema (data model) when the structure changes between app releases.

Migrations are divided into lightweight and heavyweight (simple and complex):

- **Lightweight** — automatic: Core Data infers the mapping from the differences between the old and new model. It suits obvious changes: adding or removing an attribute, renaming an entity or property (via a renaming identifier), changing an attribute's optionality, adding a relationship. It is enabled with the `NSMigratePersistentStoresAutomaticallyOption` and `NSInferMappingModelAutomaticallyOption` options.
- **Heavyweight** (manual) — needed when the changes exceed what automatic migration can handle, for example when data has to be transformed or moved between entities; then the mapping is defined by hand.
