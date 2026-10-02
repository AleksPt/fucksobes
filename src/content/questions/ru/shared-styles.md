---
title: "Как задать общие настройки для визуальных элементов и какой профит от этого?"
category: swiftui
order: 6
---

Общие модификаторы:

```swift
struct CommonStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.blue)
            .cornerRadius(10)
    }
}

extension View {
    func commonStyle() -> some View {
        self.modifier(CommonStyle())
    }
}
```

Польза:

- **Единообразие** — одинаковый визуальный стиль по всему приложению.
- **Повторное использование** — одну конфигурацию легко применять в разных местах.
- **Простота поддержки** — изменение в одном месте (в модификаторе) затрагивает все элементы, которые его используют.
