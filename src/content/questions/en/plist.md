---
title: "What is a plist file? What is it used for? What data types can be stored in a plist?"
category: data-storage
order: 17
---

A property list (plist) is a structured settings file in XML or binary format whose root is a dictionary or an array. In an app it is used for configuration: `Info.plist` describes the app's parameters, and separate plists hold static settings, reference data, and small amounts of data.

A plist can store only "list" types: `String`, `Number` (`Int`, `Double`), `Bool`, `Date`, `Data`, `Array`, and `Dictionary` (with string keys). Other types have to be encoded first, for example into `Data`. A plist is read and written through `PropertyListSerialization`, `PropertyListDecoder`, and `PropertyListEncoder` (with `Codable`). A file in the bundle is read-only, so mutable data must be saved in the app's sandbox, for example in `Documents`.
