---
title: "What is UIScene? What is it used for?"
category: uikit
order: 89
---

`UIScene` appeared in iOS 13 and represents a single instance of the app's user interface. Previously, an app had one interface, managed by `UIApplicationDelegate`. Now `UIApplicationDelegate` is responsible for the process as a whole (launch, push notifications), while the interface is handled by a `UISceneDelegate` (usually a `UIWindowSceneDelegate`), which creates the `UIWindow` and receives lifecycle events: `sceneWillEnterForeground`, `sceneDidBecomeActive`, `sceneDidEnterBackground`.

What it is for: on iPadOS (and Mac Catalyst) the user can open several windows of the same app, and each window is a separate scene with its own state. The system can disconnect and restore scenes independently (`stateRestorationActivity`), and scenes can be opened and closed programmatically (`UIApplication.requestSceneSessionActivation`). On iPhone an app usually has one scene, but the lifecycle is still implemented through it. Scene configuration is described in `Info.plist` (`UIApplicationSceneManifest`).
