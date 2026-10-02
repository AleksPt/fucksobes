---
title: "In SwiftUI, how does ZStack differ from the background/overlay modifiers?"
category: swiftui
order: 7
---

`ZStack` places child views on top of one another, each subsequent one above the previous. `background` and `overlay` put content behind or in front of the view they are applied to; multiple views in their closure are assembled into an implicit `ZStack`.

The difference is in layout: you can get the same layers with a `ZStack`, which gives a simpler hierarchy but changes layout priority. Use the `background`/`overlay` modifier when you want the original view to determine the size.

```swift
Text("Hi").background { Color.blue }   // a background behind the Text
ZStack { Color.blue; Text("Hi") }      // the same layers via ZStack
```
