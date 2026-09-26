---
title: "Какие категории View вы знаете?"
category: swiftui
order: 23
---

Каждое view в SwiftUI порождает `0` или больше *displayables* — элементов, которые реально отображаются. По этому признаку выделяют четыре основные категории:

1. **Unary** — view с ровно одним displayable: shapes, colors, controls, labels.
2. **Structural** — принимают `0` или больше view и комбинируют их: `ForEach`, `EmptyView`, а также типы, которые строит `ViewBuilder` (`TupleView`, `_ConditionalContent`).
3. **Container** — принимают другие view и управляют их расположением: `HStack`, `VStack`, `List`, `LazyVStack`.
4. **Modifiers** — добавляют или меняют внешний вид и поведение view.

Иерархия любого view состоит из примитивных view этих категорий:

```swift
struct MyView: View {
    @State var showSecret = false

    var body: some View {
        VStack {
            Group {
                Button("Show secret") { showSecret.toggle() }
                if showSecret {
                    Text("Secret")
                } else {
                    Color.red
                }
            }
            .padding()
        }
    }
}
```

Отдельно выделяют lazy-контейнеры (`List`, `LazyVStack`), которые создают элементы только когда они попадают в область прокрутки.
