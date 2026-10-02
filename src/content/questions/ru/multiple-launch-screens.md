---
title: "Сколько LaunchScreen-сторибордов может быть в приложении? Если больше одного, как система определяет, какой использовать?"
category: uikit
order: 90
---

Несколько экранов запуска в приложении возможно. По умолчанию Xcode создаёт один `LaunchScreen.storyboard`, ключ `UILaunchStoryboardName` в `Info.plist` указывает на него, и он показывается при любом запуске.

Если нужны разные экраны, в `Info.plist` вместо `UILaunchStoryboardName` задают словарь `UILaunchStoryboards`: `UILaunchStoryboardDefinitions` — массив словарей с `UILaunchStoryboardIdentifier` и `UILaunchStoryboardFile` (идентификатор и файл storyboard или xib), `UIURLToLaunchStoryboardAssociations` — соответствие URL-схем из `CFBundleURLTypes` этим идентификаторам, `UIDefaultLaunchStoryboard` — идентификатор экрана по умолчанию. Система выбирает экран по URL-схеме, которой запущено приложение, а во всех остальных случаях показывает экран по умолчанию. Для экранов без storyboard есть аналог: `UILaunchScreens` с `UILaunchScreenDefinitions`, `UIURLToLaunchScreenAssociations` и `UIDefaultLaunchScreen`.

На практике это встречается редко: чаще делают один универсальный экран запуска.
