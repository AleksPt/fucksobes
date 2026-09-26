---
title: "Что такое ZStack?"
category: swiftui
order: 33
---

`ZStack` располагает вложенные view по оси Z: каждое следующее находится выше предыдущего, то есть позднее view рисуется поверх более раннего.

```swift
let colors: [Color] = [.red, .orange, .yellow, .green, .blue, .purple]

var body: some View {
    ZStack {
        ForEach(0..<colors.count, id: \.self) {
            Rectangle()
                .fill(colors[$0])
                .frame(width: 100, height: 100)
                .offset(x: CGFloat($0) * 10, y: CGFloat($0) * 10)
        }
    }
}
```
