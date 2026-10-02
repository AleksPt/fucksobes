---
title: "Что такое property wrapper?"
category: swiftui
order: 38
---

Property wrapper — механизм Swift, который выносит повторяющуюся логику хранения и доступа к свойству в отдельный тип, помеченный `@propertyWrapper`. Тип обязан иметь свойство `wrappedValue`, а при желании и `projectedValue` (доступ через `$`).

```swift
@propertyWrapper
struct Clamped {
    private var value: Int
    let range: ClosedRange<Int>

    init(wrappedValue: Int, _ range: ClosedRange<Int>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }

    var wrappedValue: Int {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }
}

struct Player { @Clamped(0...100) var health = 100 }
```

В SwiftUI на этом построены `@State`, `@Binding`, `@ObservedObject`, `@StateObject`, `@Environment`, `@EnvironmentObject`, `@AppStorage` и другие: они хранят значение вне структуры `View` и запускают обновление интерфейса при его изменении. Префикс `$` (`$isOn`) даёт `projectedValue` — часто это `Binding`.
