---
title: "What is a property wrapper?"
category: swiftui
order: 38
---

A property wrapper is a Swift mechanism that moves repetitive logic for storing and accessing a property into a separate type marked with `@propertyWrapper`. The type must have a `wrappedValue` property and, optionally, a `projectedValue` (accessed via `$`).

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

In SwiftUI, `@State`, `@Binding`, `@ObservedObject`, `@StateObject`, `@Environment`, `@EnvironmentObject`, `@AppStorage` and others are built on this: they store the value outside the `View` struct and trigger an interface update when it changes. The `$` prefix (`$isOn`) gives the `projectedValue` — often a `Binding`.
