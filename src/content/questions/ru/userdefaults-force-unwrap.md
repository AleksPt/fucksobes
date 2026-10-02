---
title: "В чём проблема в коде, который читает цвет темы из UserDefaults через force unwrap?"
category: swift
order: 116
---

```swift
var color = UserDefaults.standard.string(forKey: "themeColor")!
print(color)
```

`string(forKey:)` возвращает `String?`: если ключ ещё ни разу не записывали (первый запуск, после удаления данных, смена ключа), результат `nil`, и принудительная распаковка `!` приведёт к падению приложения.

Исправления:

```swift
// значение по умолчанию
let color = UserDefaults.standard.string(forKey: "themeColor") ?? "blue"

// или явная обработка отсутствия значения
guard let color = UserDefaults.standard.string(forKey: "themeColor") else { return }
```

Ещё один вариант — зарегистрировать значения по умолчанию при запуске: `UserDefaults.standard.register(defaults: ["themeColor": "blue"])`, тогда чтение вернёт их, пока не записано другое. Строковый ключ лучше вынести в константу, чтобы не допустить опечатки.
