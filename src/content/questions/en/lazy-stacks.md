---
title: "What is the difference between LazyVStack and LazyHStack?"
category: swiftui
order: 32
---

The difference is the same as between `VStack` and `HStack`: `LazyVStack` lays out views vertically, `LazyHStack` horizontally.

What distinguishes lazy stacks from regular ones is loading. `VStack` and `HStack` create all of their content at once, which can be slow inside a `ScrollView`. `LazyVStack` and `LazyHStack` create views only when they come into the visible area.

```swift
struct ContentView: View {
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(1...1000, id: \.self) { value in
                    Text("Row \(value)")
                }
            }
        }
        .frame(height: 300)
    }
}
```
