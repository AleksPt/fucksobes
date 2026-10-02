---
title: "What is an unowned reference?"
category: memory
order: 27
---

It is used when the object definitely exists. If the object is gone, the app will crash.

An `unowned` reference does not return an optional type and is possibly faster than `weak`: it is not stored in a side table, and we access the object directly. It can be useful when you need speed, but you must be 100% sure that at that moment there is at least one strong reference to the object.
