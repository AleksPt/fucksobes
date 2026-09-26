---
title: "Что такое UIApplication?"
category: uikit
order: 122
---

`UIApplication` — синглтон (`UIApplication.shared`), который представляет запущенное приложение и координирует его работу с системой. Он создаётся при старте (`UIApplicationMain`), запускает главный цикл событий (run loop) и вызывает методы делегата `UIApplicationDelegate`.

Что он делает:

- хранит состояние приложения (`applicationState`: `active`, `inactive`, `background`) и передаёт события жизненного цикла делегату;
- принимает события от системы и направляет их в нужное окно и view (`sendEvent`, цепочка респондеров);
- открывает URL и другие приложения (`open(_:options:completionHandler:)`, `canOpenURL`);
- регистрирует приложение для push-уведомлений (`registerForRemoteNotifications`);
- управляет бейджем иконки (в новых версиях через `UNUserNotificationCenter`), сетевой индикацией, таймером бездействия (`isIdleTimerDisabled`) и фоновыми задачами (`beginBackgroundTask`);
- предоставляет `connectedScenes` — список сцен приложения.

С iOS 13 управление окнами и интерфейсным жизненным циклом перешло к `UIScene` и `UISceneDelegate`, а `UIApplicationDelegate` отвечает за события уровня процесса (запуск, push-токены, фоновые события). Наследоваться от `UIApplication` нужно редко.
