---
title: "Что такое App Transport Security (ATS)?"
category: networking
order: 14
---

App Transport Security — настройка безопасности, которая по умолчанию (с iOS 9) заставляет приложение использовать защищённые соединения. Она действует для сетевых запросов через `URLSession` и другие API высокого уровня (для `WKWebView` действует отдельная настройка).

Требования ATS: соединение по HTTPS, TLS не ниже 1.2, шифры с forward secrecy, сертификаты с достаточно надёжной подписью и длиной ключа. Небезопасные запросы (`http://`) блокируются, а в консоли появляется ошибка.

Исключения задаются в `Info.plist` в ключе `NSAppTransportSecurity`:

- `NSAllowsArbitraryLoads` — отключает ATS для всего приложения (App Store требует объяснения);
- `NSExceptionDomains` — исключения для конкретных доменов: `NSExceptionAllowsInsecureHTTPLoads`, `NSExceptionMinimumTLSVersion`, `NSIncludesSubdomains`;
- `NSAllowsLocalNetworking` — разрешает запросы в локальной сети;
- `NSAllowsArbitraryLoadsInWebContent` — для содержимого `WKWebView`.

Рекомендуется не отключать ATS, а перевести сервер на HTTPS, при необходимости сделав точечное исключение для нужного домена.
