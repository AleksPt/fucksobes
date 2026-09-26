---
title: "Что такое паттерн Decorator?"
category: architecture
order: 44
---

Decorator (декоратор) — структурный паттерн, который динамически добавляет объекту новое поведение, «оборачивая» его в другой объект с тем же интерфейсом. Обёртка делегирует вызовы исходному объекту и дополняет их своей логикой до или после вызова. В отличие от наследования, поведение можно комбинировать во время выполнения, не создавая множество подклассов.

В Swift паттерн обычно строят на протоколах:

```swift
protocol DataSource { func load() -> [String] }

struct RemoteSource: DataSource {
    func load() -> [String] { ["a", "b"] }
}

struct LoggingSource: DataSource {
    let base: DataSource
    func load() -> [String] {
        print("load started")
        return base.load()
    }
}

let source: DataSource = LoggingSource(base: RemoteSource())
```

Так добавляют логирование, кэширование, метрики, повторные попытки. Ещё один способ расширять поведение без наследования в Swift — `extension`, но он добавляет функциональность типу целиком, а декоратор действует на конкретный экземпляр.
