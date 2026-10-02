---
title: "How do you define shared settings for visual elements, and what are the benefits?"
category: swiftui
order: 6
---

Shared modifiers:

```swift
struct CommonStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.blue)
            .clipShape(.rect(cornerRadius: 10))
    }
}

extension View {
    func commonStyle() -> some View {
        self.modifier(CommonStyle())
    }
}
```

Benefits:

- **Consistency** — the same visual style across the whole app.
- **Reuse** — one configuration is easy to apply in different places.
- **Easy maintenance** — a change in one place (in the modifier) affects all the elements that use it.
