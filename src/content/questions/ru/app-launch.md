---
title: "Что происходит при нажатии на иконку приложения?"
category: uikit
order: 71
---

Система создаёт процесс приложения. При запуске UIKit автоматически создаёт объект `UIApplication` и делегат приложения (`UIApplicationDelegate`), запускает главный цикл событий (main event loop) и только затем подключает одну или несколько сцен. Пока приложение не готово показать интерфейс, пользователь видит launch storyboard.

В начале запуска UIKit вызывает `application(_:willFinishLaunchingWithOptions:)` и `application(_:didFinishLaunchingWithOptions:)`, а для сцены — `scene(_:willConnectTo:options:)`. Здесь выполняют начальную настройку, а долгие задачи выносят из этой цепочки или откладывают, иначе приложение будет запускаться медленно.

