---
title: "How do relational databases differ from other databases?"
category: data-storage
order: 32
---

**Relational** databases (SQLite, PostgreSQL, MySQL) store data in tabular form: rows and columns with a predefined schema. Related data lives in separate tables, and the link between them is expressed through foreign keys rather than direct references to objects. Because of this, operations on related data (a join of several tables) are relatively expensive: they require looking up and matching records across several tables at once, especially on large volumes and without proper indexes.

In return they provide strict **consistency** (ACID transactions), normalization (no data duplication), and a powerful declarative query language (SQL).

Other storage models work differently:

- **Document databases** (MongoDB, CouchDB) — store self-contained documents (usually JSON/BSON) without a rigid schema; related data is often duplicated or embedded directly into the document rather than moved to a separate table. This makes reading a whole entity faster, but introduces duplication and makes it harder to keep the data consistent.
- **Object databases** (Realm, Core Data on top of SQLite) — store "live" objects with direct references to each other (graphs) rather than tables with foreign keys; related data is obtained directly through a relationship property, without an explicit join.
- **Key-value** (Redis, UserDefaults) — the simplest model: a value is retrieved by key in O(1), with no queries on content and no schema.
- **Columnar databases** (Cassandra, BigQuery) — data is physically stored by columns rather than by rows; they suit analytics over large volumes, where you read not the whole record but specific columns across many rows at once.

The choice of model is a trade-off between a strict schema and flexibility, write speed and the speed of reading related data, and how predictable future changes to the data structure are.
