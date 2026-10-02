---
title: "Where can Core Data data be stored?"
category: data-storage
order: 20
---

The storage location is determined by the type of `NSPersistentStore` attached to the coordinator:

- `NSSQLiteStoreType` — a SQLite file on disk (the default and the most common choice); data persists between launches;
- `NSBinaryStoreType` — a binary file; it is loaded into memory entirely;
- `NSInMemoryStoreType` — RAM only; the data is lost when the app closes, which is handy in tests;
- `NSXMLStoreType` — an XML file (macOS only).

By default the SQLite file lives in the `Application Support` directory inside the app's sandbox. You can specify your own path, including a shared App Group container, to share data with extensions. With `NSPersistentCloudKitContainer` the data is additionally synced with iCloud.
