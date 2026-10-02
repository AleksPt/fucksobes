---
title: "What is the difference between .gesture and .simultaneousGesture?"
category: swiftui
order: 51
---

Both modifiers attach a gesture to a view, but they behave differently when another gesture is nearby — for example, a built-in gesture of a button or of a parent/child view.

- **`.gesture(_:)`** — adds a gesture **with priority**: if it is recognized, it "intercepts" the event and prevents other gestures on the same or nested views from firing (including, for example, the `.onTapGesture` of a button inside). Gestures compete, and only one fires.
- **`.simultaneousGesture(_:)`** — adds a gesture that can be recognized **at the same time** as other gestures in the same hierarchy without blocking them. Both gestures receive events and can fire together.

```swift
Button("Tap") { print("tap") }
    .simultaneousGesture(
        DragGesture().onChanged { _ in print("drag") }
        // both the button's regular tap and the drag fire independently
    )

Button("Tap") { print("tap") }
    .gesture(
        DragGesture().onChanged { _ in print("drag") }
        // the drag will intercept the event, the button's tap may not fire
    )
```

A practical use for `.simultaneousGesture` is when you need to add your own gesture (for example, tracking a drag or a long press for analytics) without interfering with the standard behavior of the view it is attached to — for instance, without blocking a button tap or list scrolling.
