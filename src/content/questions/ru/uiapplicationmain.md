---
title: "Что означает UIApplicationMain?"
category: uikit
order: 151
---

`UIApplicationMain` — атрибут (`@UIApplicationMain`) и одноимённая C-функция, которые раньше были **точкой входа** iOS-приложения на UIKit.

Что она делает при запуске:

- создаёт экземпляр `UIApplication` (или указанный кастомный подкласс) и делает его `UIApplication.shared`;
- создаёт экземпляр делегата приложения и назначает его `UIApplication.delegate`;
- запускает главный **run loop**, который обрабатывает события и держит приложение живым до завершения.

`@UIApplicationMain` ставился перед классом `AppDelegate` и заменял ручной `main.swift` с явным вызовом `UIApplicationMain(_:_:_:_:)`, передающим имена классов `UIApplication` и делегата по строке.

```swift
// Файл main.swift, который эквивалентен @UIApplicationMain
import UIKit

UIApplicationMain(
    CommandLine.argc,
    CommandLine.unsafeArgv,
    nil,                              // класс UIApplication по умолчанию
    NSStringFromClass(AppDelegate.self)
)
```

Начиная со Swift 5.3 (SE-0281) точку входа можно задать атрибутом **`@main`**: для UIKit его поддерживает `UIApplicationDelegate` (метод `main()`), а в документации Apple точкой входа названа именно метка `@main`. `@UIApplicationMain` остаётся рабочим, но в режиме языка Swift 6 помечен как deprecated (компилятор предлагает `@main`). С `UIScene` (iOS 13) этот выбор не связан.
