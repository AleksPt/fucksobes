---
title: "Что такое DI-контейнер?"
category: architecture
order: 63
---

DI-контейнер — объект, который знает, как создавать зависимости, и выдаёт их по запросу. В нём регистрируют типы (обычно протокол → способ создания), а затем «разрешают» (resolve) нужный экземпляр вместе с его собственными зависимостями.

```swift
final class Container {
    private var factories: [String: () -> Any] = [:]
    func register<T>(_ type: T.Type, factory: @escaping () -> T) {
        factories[String(describing: type)] = factory
    }
    func resolve<T>(_ type: T.Type) -> T {
        factories[String(describing: type)]!() as! T
    }
}

container.register(NetworkService.self) { URLSessionService() }
let service = container.resolve(NetworkService.self)
```

Обычно поддерживаются области жизни (scope): singleton (один экземпляр), transient (новый при каждом запросе), graph и другие. Готовые решения: Swinject, Factory, Needle.

Плюсы: зависимости создаются в одном месте, удобно подменять реализации в тестах, меньше ручной сборки. Минусы: ошибки регистрации выявляются только в рантайме, дополнительная сложность, а использование контейнера внутри классов превращается в антипаттерн Service Locator. Хорошая практика: собирать зависимости в composition root и передавать их через инициализаторы.
