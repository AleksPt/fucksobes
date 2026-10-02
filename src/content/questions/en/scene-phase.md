---
title: "What scene states exist in SwiftUI and how do you track them (scenePhase)?"
category: swiftui
order: 39
---

A scene in SwiftUI can be in one of three `ScenePhase` states:

- `active` — the scene is on screen and the user can interact with it;
- `inactive` — the scene is visible but not receiving input (for example, during a transition, in the app switcher, or while a system dialog is shown);
- `background` — the scene is not displayed, the app is running in the background and may soon be suspended or terminated.

You read the current state from the environment and react to changes with `onChange`:

```swift
struct RootView: View {
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ContentView()
            .onChange(of: scenePhase) { _, newPhase in
                if newPhase == .background { saveState() }
            }
    }
}
```

A value read from a `View` describes the scene the view is in, while one read from `App` is the aggregated state of all scenes. Typically you save data on `background` and resume work on `active`. It replaces the `UIApplicationDelegate` and `UISceneDelegate` methods from UIKit.
