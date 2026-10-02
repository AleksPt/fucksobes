---
title: "What is JSON? What is it used for?"
category: networking
order: 6
---

JSON (JavaScript Object Notation) is a text-based data interchange format. It is built from objects `{ "key": value }`, arrays `[...]`, and simple values: strings, numbers, `true`/`false` and `null`.

```json
{ "name": "Mark", "age": 30, "tags": ["ios", "swift"] }
```

JSON is human-readable, compact, language-independent and supported almost everywhere, which makes it the most common format for exchanging data between client and server. It is also used for configuration files and for storing small amounts of data locally. In Swift it is parsed and produced with `Codable`.
