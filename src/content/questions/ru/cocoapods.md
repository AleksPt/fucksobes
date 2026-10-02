---
title: "Что такое CocoaPods? Как его использовать?"
category: tooling
order: 25
---

CocoaPods — менеджер зависимостей для проектов Apple-платформ, написанный на Ruby. Библиотеки («поды») лежат в общем реестре, а описание зависимостей ведётся в файле `Podfile`.

Использование:

1. Установить: `sudo gem install cocoapods` или через Homebrew (`brew install cocoapods`).
2. Создать `Podfile` (`pod init`) и перечислить зависимости:

```ruby
platform :ios, '15.0'
use_frameworks!

target 'MyApp' do
  pod 'Alamofire', '~> 5.8'
end
```

3. Выполнить `pod install`: CocoaPods скачает библиотеки, создаст проект `Pods`, файл `Podfile.lock` (фиксирует версии) и `.xcworkspace`.
4. С этого момента открывать проект нужно через `.xcworkspace`.

Обновить версии можно командой `pod update`. Минусы: дополнительный workspace и изменение файлов проекта, требуется Ruby-окружение, а сам проект CocoaPods перешёл в режим поддержки, и все новые библиотеки чаще выходят для SPM.
