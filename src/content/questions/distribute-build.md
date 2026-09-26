---
title: "Как распространить билд в App Store Connect и TestFlight?"
category: tooling
order: 31
---

Порядок такой:

1. В App Store Connect создают запись приложения с нужным Bundle ID.
2. В Xcode выбирают устройство **Any iOS Device (arm64)** и создают архив: **Product → Archive** (нужны Distribution-сертификат и профиль, или автоматическая подпись).
3. В Organizer выбирают архив и жмут **Distribute App → App Store Connect → Upload**. Xcode подписывает сборку и загружает её.
4. После обработки (несколько минут) сборка появляется в App Store Connect, вкладка TestFlight. Затем её выдают внутренним и внешним тестировщикам, а для релиза выбирают эту сборку в версии приложения и отправляют на проверку.

Альтернативы Xcode для загрузки: приложение Transporter и `xcodebuild -exportArchive`, а в CI чаще используют fastlane (`gym`, `pilot`) и App Store Connect API. Номер сборки (`CFBundleVersion`) должен быть уникальным для каждой загрузки в пределах версии.
