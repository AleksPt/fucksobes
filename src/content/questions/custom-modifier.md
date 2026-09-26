---
title: "Как создать свой модификатор?"
category: swiftui
order: 25
---

Нужно создать структуру, соответствующую `ViewModifier`. Единственное требование — метод `body(content:)`, который принимает view, к которому применяется модификатор, и возвращает `some View`:

```swift
struct Title: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.largeTitle)
            .foregroundStyle(.white)
            .padding()
            .background(.blue)
            .clipShape(.rect(cornerRadius: 10))
    }
}
```

Применяют его через модификатор `modifier(_:)`:

```swift
Text("Hello World")
    .modifier(Title())
```

Обычно для удобства добавляют расширение `View`:

```swift
extension View {
    func titleStyle() -> some View {
        modifier(Title())
    }
}

Text("Hello World")
    .titleStyle()
```
