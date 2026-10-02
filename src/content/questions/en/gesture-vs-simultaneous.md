---
title: "What is the difference between .gesture and .simultaneousGesture?"
category: swiftui
order: 51
---

Both modifiers attach a gesture to a view, but they behave differently when another gesture is nearby — for example, a built-in gesture of a button or of a parent/child view.

- **`.gesture(_:)`** — adds a gesture with **lower priority** than the gestures the view and its child views already have: if they conflict, the child view's gesture (for example, an `.onTapGesture` on a nested image) fires instead of this one. Gestures compete, and only one fires. For a parent's gesture to intercept events, you need `.highPriorityGesture(_:)`.
- **`.simultaneousGesture(_:)`** — adds a gesture that can be recognized **at the same time** as other gestures in the same hierarchy without blocking them. Both gestures receive events and can fire together.

```swift
let tap = TapGesture().onEnded { print("tap on VStack") }

VStack {
    Image(systemName: "heart.fill")
        .onTapGesture { print("tap on image") }
}
.gesture(tap)                // tapping the image: only "tap on image"
// .simultaneousGesture(tap) // tapping the image: both messages
// .highPriorityGesture(tap) // tapping the image: only "tap on VStack"
```

A practical use for `.simultaneousGesture` is when you need to add your own gesture (for example, tracking a drag or a long press for analytics) without interfering with the standard behavior of the view it is attached to — for instance, without blocking a button tap or list scrolling.
