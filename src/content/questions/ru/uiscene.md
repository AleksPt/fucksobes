---
title: "Что такое UIScene? Для чего используется?"
category: uikit
order: 89
---

`UIScene` появился в iOS 13 и представляет один экземпляр пользовательского интерфейса приложения. Раньше приложение имело один интерфейс, которым управлял `UIApplicationDelegate`. Теперь `UIApplicationDelegate` отвечает за процесс в целом (запуск, push-уведомления), а за интерфейс отвечает `UISceneDelegate` (обычно `UIWindowSceneDelegate`), который создаёт `UIWindow` и получает события жизненного цикла: `sceneWillEnterForeground`, `sceneDidBecomeActive`, `sceneDidEnterBackground`.

Зачем нужно: на iPadOS (и Mac Catalyst) пользователь может открыть несколько окон одного приложения, и каждое окно — отдельная сцена со своим состоянием. Система может независимо отключать и восстанавливать сцены (`stateRestorationActivity`), а сцены можно открывать и закрывать программно (`UIApplication.requestSceneSessionActivation`). На iPhone у приложения обычно одна сцена, но жизненный цикл всё равно реализуется через неё. Конфигурация сцен описывается в `Info.plist` (`UIApplicationSceneManifest`).
