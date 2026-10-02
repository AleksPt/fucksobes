---
title: "Что такое ViewModifier?"
category: swiftui
order: 24
---

`ViewModifier` — протокол для создания собственных переиспользуемых модификаторов, которые можно применить к любому view. В UIKit вы меняли свойства объекта (`view.backgroundColor = .red`), в SwiftUI — описываете внешний вид цепочкой модификаторов. `ViewModifier` позволяет упаковать такую цепочку в один тип.

```swift
struct BorderedCaption: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.caption2)
            .padding(10)
            .overlay(
                RoundedRectangle(cornerRadius: 15)
                    .stroke(lineWidth: 1)
            )
            .foregroundColor(.blue)
    }
}
```

Модификатор вычисляется лениво, когда это нужно, а не при добавлении к view.
