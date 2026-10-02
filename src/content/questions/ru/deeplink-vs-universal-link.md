---
title: "Чем отличаются deeplink (URL scheme) и Universal Link? Что нужно для работы Universal Link?"
category: uikit
order: 123
---

**Deeplink через custom URL scheme** (`myapp://product/42`): схему регистрируют в `Info.plist` (`CFBundleURLTypes`). Ссылка открывает приложение, если оно установлено; если нет, будет ошибка. Схема не уникальна: другое приложение может заявить ту же. Подходит для внутренних переходов, но небезопасна и не имеет веб-запасного варианта.

**Universal Link** — обычная HTTPS-ссылка (`https://example.com/product/42`), которая открывает приложение, если оно установлено, а иначе — сайт в браузере. Домен принадлежит вам и подтверждён, поэтому подменить ссылку нельзя.

Что нужно для Universal Link:

1. Capability **Associated Domains** с записью `applinks:example.com`.
2. Файл `apple-app-site-association` (JSON без расширения) на сервере по адресу `https://example.com/.well-known/apple-app-site-association`: по HTTPS, без редиректов, с идентификатором приложения (`TeamID.BundleID`) и списком путей.
3. Обработка ссылки в приложении: `scene(_:continue:)` или `application(_:continue:restorationHandler:)` с `NSUserActivityTypeBrowsingWeb` (в SwiftUI — `onOpenURL`).

Нюансы: ссылка должна быть нажата пользователем (ввод в адресную строку Safari открывает сайт), а система кеширует файл через CDN Apple, поэтому изменения применяются не сразу.
