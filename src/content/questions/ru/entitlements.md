---
title: "Что такое entitlements-файл? Что в нём находится?"
category: tooling
order: 35
---

Entitlements — файл `.entitlements` (plist) с перечнем прав и возможностей, которые приложение запрашивает у системы. Они подписываются вместе с приложением, и система проверяет, что права разрешены в App ID и provisioning profile.

В нём указывают, например:

- `aps-environment` — Push-уведомления (development или production);
- `com.apple.security.application-groups` — App Groups для обмена данными между приложением и расширениями;
- `keychain-access-groups` — общий доступ к Keychain;
- `com.apple.developer.icloud-*` — iCloud и CloudKit;
- `com.apple.developer.associated-domains` — Universal Links;
- Sign in with Apple, HealthKit, Apple Pay и другие возможности; для macOS — параметры песочницы (`com.apple.security.app-sandbox`).

Добавляют возможности во вкладке **Signing & Capabilities**: Xcode сам обновляет файл и включает возможность в App ID. Если права в файле не совпадают с профилем, сборка не запустится или подписать её не получится.
