---
title: "Как получать одни и те же данные из локального хранилища в двух приложениях (Core Data и App Groups)?"
category: data-storage
order: 26
---

Каждое приложение живёт в своей песочнице, поэтому напрямую читать чужие файлы нельзя. Общий доступ даёт **App Group** — общий контейнер, доступный приложениям и расширениям одного разработчика.

1. В Apple Developer Portal создают App Group (`group.com.company.shared`) и включают capability **App Groups** во вкладке Signing & Capabilities всех целей, которым нужен доступ.
2. Путь к общему контейнеру получают через `FileManager.default.containerURL(forSecurityApplicationGroupIdentifier:)`.
3. Для Core Data адрес хранилища указывают в описании `NSPersistentStoreDescription`, чтобы файл SQLite лежал в общем контейнере, а не в контейнере приложения:

```swift
let container = NSPersistentContainer(name: "Model")
let url = FileManager.default
    .containerURL(forSecurityApplicationGroupIdentifier: "group.com.company.shared")!
    .appendingPathComponent("Model.sqlite")
container.persistentStoreDescriptions = [NSPersistentStoreDescription(url: url)]
```

Для небольших данных есть `UserDefaults(suiteName: "group.com.company.shared")`, для секретов — общий Keychain access group.

Оговорки: два процесса могут писать в базу одновременно, поэтому включают режим WAL и отслеживают изменения из других процессов (persistent history tracking и `NSPersistentStoreRemoteChangeNotificationPostOptionKey`), чтобы обновлять контексты.
