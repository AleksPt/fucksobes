---
title: "How can a View track a change of the device theme (light/dark)? What happens if you pass nil to preferredColorScheme?"
category: swiftui
order: 44
---

You can track a theme change with `@Environment(\.colorScheme)`: SwiftUI subscribes the view to changes of this value and re-evaluates `body` when the user switches the system theme (or when it is forcibly changed within the app).

```swift
struct ThemedView: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        Text(colorScheme == .dark ? "Dark theme" : "Light theme")
    }
}
```

The `.preferredColorScheme(_:)` modifier works the other way around — it sets which theme a particular view hierarchy should use, regardless of the system setting:

```swift
ContentView()
    .preferredColorScheme(.dark) // force the dark theme for this hierarchy
```

If you pass `nil` — `preferredColorScheme(nil)` — the forced override is **removed**, and the hierarchy goes back to the theme set higher up the tree (by a parent `.preferredColorScheme`) or, if there is none, to the device's system setting. This is handy, for example, to reset a locally set theme for a single screen and make it follow the app-wide setting again.
