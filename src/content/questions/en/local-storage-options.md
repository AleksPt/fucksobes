---
title: "Where can you store local data on the device?"
category: data-storage
order: 1
---

Three main mechanisms:

- Files in the app container: `Documents` (user content), `Library` (the app's service files, for example `Application Support`), `Library/Caches` (anything that can be recreated; not included in the backup), `tmp` (temporary files).
- `UserDefaults` — small non-secret settings as key-value pairs.
- Keychain — small secrets: passwords, keys, certificates.

For settings that need to be shared across the user's devices, there is `NSUbiquitousKeyValueStore` (iCloud).
