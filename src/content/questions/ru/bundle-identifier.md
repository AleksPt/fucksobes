---
title: "Что такое bundle identifier?"
category: tooling
order: 32
---

Bundle identifier (Bundle ID) — уникальный идентификатор приложения в обратной доменной записи, например `com.company.myapp`. Он задаётся в настройках цели и хранится в `Info.plist` (`CFBundleIdentifier`).

Он нужен, чтобы:

- однозначно отличать приложение в системе и в App Store: два приложения с одним Bundle ID установить нельзя;
- связывать приложение с профилем provisioning, сертификатами и записью в App Store Connect;
- определять доступ к возможностям (Push, Keychain-группы, App Groups, iCloud) через App ID;
- различать версии для разных окружений: например, `com.company.myapp.dev` для тестовой сборки, чтобы иметь на устройстве и dev-, и production-версию.

После публикации в App Store Bundle ID менять нельзя. Для расширений (extensions) используют идентификаторы с префиксом основного приложения.
