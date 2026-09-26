---
title: "Что такое Environment в SwiftUI и как его использовать."
category: swiftui
order: 14
---

`Environment` — property wrapper, который читает значение из окружения view. Значение выбирается key path'ом по `EnvironmentValues`. Через него можно только читать значения, задавать их нужно модификатором `environment(_:_:)`.

```swift
@Environment(\.colorScheme) var colorScheme: ColorScheme
```

Если значение меняется, SwiftUI обновляет части view, которые от него зависят. Часть значений SwiftUI обновляет сама по системным настройкам, часть можно переопределить, а также задать собственные (через `EnvironmentKey` или макрос `Entry()`).

Через окружение можно раздавать и `@Observable`-объекты: положить `.environment(library)`, достать `@Environment(Library.self) private var library`. Если объекта в окружении нет, SwiftUI бросит исключение; чтобы получить `nil`, запрашивают опциональный тип: `@Environment(Library.self) private var library: Library?`.
