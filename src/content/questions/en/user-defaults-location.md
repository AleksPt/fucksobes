---
title: "Where is UserDefaults stored?"
category: data-storage
order: 3
---

`UserDefaults` stores data locally on the device: in memory the object is updated immediately, while the write to disk happens asynchronously. The preferences files live in `Library/Preferences` of the app container; you should not create them by hand: work through `UserDefaults`. This data is included in the device backup and is not transferred to other devices (`NSUbiquitousKeyValueStore` exists for that).
