---
title: "How are dictionaries implemented?"
category: algorithms
order: 10
---

`Dictionary` is a hash table (a type of hash table) in which an entry is identified by a key; the key must be `Hashable`. A value is looked up by key through a subscript that returns an optional, since the key may be missing. Assigning to an existing key overwrites the value, assigning to a new key adds a pair, and assigning `nil` removes it.

The order of pairs is undefined: it is stable between mutations but otherwise unpredictable. If you need order and don't need fast lookup by key, the documentation suggests `KeyValuePairs`.
