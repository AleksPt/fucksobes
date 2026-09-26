---
title: "Что такое modifier и для чего он нужен?"
category: swiftui
order: 5
---

Modifier изменяет или добавляет поведение и стиль представлений (views).

Он позволяет менять внешний вид, компоновку и другие свойства представления: цвет, шрифт, границы, отступы, анимацию.

Модификатор не меняет существующее view, а оборачивает его и возвращает новое, поэтому порядок модификаторов важен:

```swift
Text("Hello")
    .font(.caption2)
    .padding(10)
    .overlay(
        RoundedRectangle(cornerRadius: 15)
            .stroke(lineWidth: 1)
    )
    .foregroundColor(.blue)
```
