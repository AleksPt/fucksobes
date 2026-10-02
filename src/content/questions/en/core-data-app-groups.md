---
title: "How can two apps get the same data from local storage (Core Data and App Groups)?"
category: data-storage
order: 26
---

Each app lives in its own sandbox, so it cannot read another app's files directly. Shared access is provided by an **App Group**: a shared container available to apps and extensions from the same developer.

1. In the Apple Developer Portal, create an App Group (`group.com.company.shared`) and enable the **App Groups** capability on the Signing & Capabilities tab of every target that needs access.
2. Get the path to the shared container with `FileManager.default.containerURL(forSecurityApplicationGroupIdentifier:)`.
3. For Core Data, specify the store location in an `NSPersistentStoreDescription` so that the SQLite file lives in the shared container rather than in the app's own container:

```swift
let container = NSPersistentContainer(name: "Model")
let url = FileManager.default
    .containerURL(forSecurityApplicationGroupIdentifier: "group.com.company.shared")!
    .appendingPathComponent("Model.sqlite")
container.persistentStoreDescriptions = [NSPersistentStoreDescription(url: url)]
```

For small amounts of data there is `UserDefaults(suiteName: "group.com.company.shared")`, and for secrets there is a shared Keychain access group.

Caveats: two processes may write to the database at the same time, so enable WAL mode and observe changes from other processes (persistent history tracking and `NSPersistentStoreRemoteChangeNotificationPostOptionKey`) to refresh your contexts.
