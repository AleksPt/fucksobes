---
title: "What is ViewModifier?"
category: swiftui
order: 24
---

`ViewModifier` is a protocol for creating your own reusable modifiers that can be applied to any view. In UIKit you changed an object's properties (`view.backgroundColor = .red`); in SwiftUI you describe the appearance with a chain of modifiers. `ViewModifier` lets you package such a chain into a single type.

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

The modifier is evaluated lazily, when it is needed, not when it is added to a view.
