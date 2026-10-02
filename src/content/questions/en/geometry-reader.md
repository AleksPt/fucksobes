---
title: "When should you use GeometryReader?"
category: swiftui
order: 30
---

`GeometryReader` is a view that reports the size and position of the space available to it. It is needed when sizes depend on the container or the screen and can't be solved with hard-coded values.

For example, to make one view take a third of the width and another two thirds:

```swift
GeometryReader { geometry in
    HStack(spacing: 0) {
        Text("Left")
            .font(.largeTitle)
            .foregroundStyle(.black)
            .frame(width: geometry.size.width * 0.33)
            .background(.yellow)
        Text("Right")
            .font(.largeTitle)
            .foregroundStyle(.black)
            .frame(width: geometry.size.width * 0.67)
            .background(.orange)
    }
}
.frame(height: 50)
```

Keep in mind that `GeometryReader` greedily takes all the space offered to it, so use it sparingly.
