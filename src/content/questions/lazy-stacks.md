---
title: "В чем отличие LazyVStack от LazyHStack?"
category: swiftui
order: 32
---

Отличие такое же, как у `VStack` и `HStack`: `LazyVStack` располагает view по вертикали, `LazyHStack` — по горизонтали.

Отличие ленивых стеков от обычных — в загрузке. `VStack` и `HStack` создают всё содержимое сразу, что может быть медленно внутри `ScrollView`. `LazyVStack` и `LazyHStack` создают view только когда они попадают в видимую область.

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
