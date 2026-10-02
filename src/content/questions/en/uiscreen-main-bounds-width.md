---
title: "What is UIScreen.main.bounds.width and how is it used for adaptive layout?"
category: swiftui
order: 54
---

`UIScreen.main` is a static property of the `UIScreen` class that returns the device's main screen object. `bounds` is a `CGRect` describing the screen size in points (not physical pixels — the screen scale, for example Retina, is already accounted for). `width` is the width of that rectangle.

```swift
struct ContentView: View {
    var body: some View {
        Rectangle()
            .fill(Color.blue)
            .frame(width: UIScreen.main.bounds.width, height: 200)
    }
}
```

It is used to:

- stretch an element to the full screen width (full-screen views, background images);
- adjust sizes to the device orientation (portrait/landscape);
- unify the look of the interface across different screen sizes.

**Drawbacks and why to be careful:**

- `UIScreen.main` doesn't take size classes or the real container size into account — on an iPad in Split View, or in multitasking mode on a Mac, the screen width and the view width may differ.
- The API belongs to UIKit, not SwiftUI, so in declarative code `GeometryReader` or the `.containerRelativeFrame` modifier is usually preferable, since they take the size from the parent container rather than from the whole screen.
