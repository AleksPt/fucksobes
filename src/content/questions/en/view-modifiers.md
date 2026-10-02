---
title: "What is a modifier and what is it for?"
category: swiftui
order: 5
---

A modifier changes or adds behavior and style to views.

It lets you change a view's appearance, layout and other properties: color, font, borders, padding, animation.

A modifier doesn't change the existing view; it wraps it and returns a new one, so the order of modifiers matters:

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
