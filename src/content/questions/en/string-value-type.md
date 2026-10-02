---
title: "Is String a value type or a reference type?"
category: swift
order: 11
---

`String` is a **value type**. Strings work like arrays of characters, and thanks to the Copy-on-Write mechanism inherent in collections, they behave efficiently: when copied, if the string is not modified, the new variable refers to the same region of memory, and a full copy happens only on modification.
