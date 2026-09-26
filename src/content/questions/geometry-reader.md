---
title: "Когда стоит использовать GeometryReader?"
category: swiftui
order: 30
---

`GeometryReader` — view, которое сообщает размер и положение доступного ему пространства. Оно нужно, когда размеры зависят от контейнера или экрана, а жёстко заданными значениями это не решить.

Например, чтобы одно view занимало треть ширины, а другое две трети:

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

Учитывайте, что `GeometryReader` жадно занимает всё предложенное место, поэтому применяйте его точечно.
