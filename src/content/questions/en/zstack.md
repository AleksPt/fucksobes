---
title: "What is ZStack?"
category: swiftui
order: 33
---

`ZStack` arranges its child views along the Z axis: each subsequent one sits above the previous one, i.e. a later view is drawn on top of an earlier one.

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
