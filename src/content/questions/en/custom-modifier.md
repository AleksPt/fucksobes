---
title: "How do you create a custom modifier?"
category: swiftui
order: 25
---

Create a struct that conforms to `ViewModifier`. Its only requirement is the `body(content:)` method, which takes the view the modifier is applied to and returns `some View`:

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

You apply it with the `modifier(_:)` modifier:

```swift
Text("Hello World")
    .modifier(Title())
```

For convenience, you usually add an extension on `View`:

```swift
extension View {
    func titleStyle() -> some View {
        modifier(Title())
    }
}

Text("Hello World")
    .titleStyle()
```
