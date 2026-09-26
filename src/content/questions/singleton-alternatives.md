---
title: "Что мы можем использовать вместо синглтона"
category: architecture
order: 17
---

Dependency Injection: зависимость передают объекту снаружи (через инициализатор, свойство или параметр метода), а не берут из глобального `shared`. Обычно её скрывают за протоколом, чтобы в тестах подставить заглушку:

```swift
protocol Analytics { func track(_ event: String) }

final class Screen {
    private let analytics: Analytics
    init(analytics: Analytics) { self.analytics = analytics }
}
```

Экземпляр создают один раз на верхнем уровне (например, в composition root или через контейнер зависимостей) и передают тем, кому он нужен. Так остаётся единственный экземпляр, но зависимости видны явно, а код проще тестировать. Другие варианты: значения окружения в SwiftUI (`@Environment`), сервис-локатор (с оговорками) и передача замыканий.
