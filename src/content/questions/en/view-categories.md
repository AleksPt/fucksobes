---
title: "What categories of View do you know?"
category: swiftui
order: 23
---

Every view in SwiftUI produces `0` or more *displayables* — the elements that are actually rendered. Based on this, four main categories are distinguished:

1. **Unary** — views with exactly one displayable: shapes, colors, controls, labels.
2. **Structural** — take `0` or more views and combine them: `ForEach`, `EmptyView`, as well as the types built by `ViewBuilder` (`TupleView`, `_ConditionalContent`).
3. **Container** — take other views and manage their layout: `HStack`, `VStack`, `List`, `LazyVStack`.
4. **Modifiers** — add to or change a view's appearance and behavior.

The hierarchy of any view consists of primitive views of these categories:

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

Lazy containers (`List`, `LazyVStack`) are singled out separately: they create elements only when they enter the scrolling area.
