---
title: "What happens when you tap the app icon?"
category: uikit
order: 71
---

The system creates the app's process. On launch, UIKit automatically creates the `UIApplication` object and the app delegate (`UIApplicationDelegate`), starts the main event loop, and only then connects one or more scenes. While the app is not yet ready to show its interface, the user sees the launch storyboard.

At the start of launch, UIKit calls `application(_:willFinishLaunchingWithOptions:)` and `application(_:didFinishLaunchingWithOptions:)`, and for a scene, `scene(_:willConnectTo:options:)`. This is where the initial setup is done; long-running tasks should be moved out of this chain or deferred, otherwise the app will launch slowly.
