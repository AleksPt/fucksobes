---
title: "Можно ли объединить код на Objective-C и Swift в одном проекте? Если да, то как?"
category: swift
order: 101
---

Да, в одном таргете могут сосуществовать оба языка.

- **Вызов Objective-C из Swift:** создают bridging header (`<Project>-Bridging-Header.h`), где импортируют нужные заголовки `#import "MyClass.h"`, и указывают его в настройке `Objective-C Bridging Header`. Тогда все объявленные там типы видны в Swift. В фреймворке вместо этого используют umbrella header.
- **Вызов Swift из Objective-C:** импортируют автоматически сгенерированный заголовок `#import "<ProductModuleName>-Swift.h"` (в фреймворке `<Framework/Framework-Swift.h>`). В нём доступны типы, помеченные `@objc` или наследующие `NSObject`.

Чтобы Swift-код был виден из Objective-C, нужны `@objc`, `@objcMembers` и `dynamic` для динамической диспетчеризации; не все возможности Swift доступны: дженерики, структуры, перечисления с associated values, протоколы с `associatedtype`, кортежи и вложенные типы недоступны из Objective-C. Для лучшей интеграции Objective-C-код размечают `nullability` (`nonnull`, `nullable`) и `NS_SWIFT_NAME`.
