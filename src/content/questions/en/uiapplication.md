---
title: "What is UIApplication?"
category: uikit
order: 122
---

`UIApplication` is a singleton (`UIApplication.shared`) that represents the running app and coordinates its work with the system. It is created at startup (`UIApplicationMain`), starts the main event loop (run loop) and calls the `UIApplicationDelegate` methods.

What it does:

- stores the app state (`applicationState`: `active`, `inactive`, `background`) and passes lifecycle events to the delegate;
- receives events from the system and routes them to the right window and view (`sendEvent`, the responder chain);
- opens URLs and other apps (`open(_:options:completionHandler:)`, `canOpenURL`);
- registers the app for push notifications (`registerForRemoteNotifications`);
- manages the icon badge (in newer versions through `UNUserNotificationCenter`), the network activity indicator, the idle timer (`isIdleTimerDisabled`) and background tasks (`beginBackgroundTask`);
- provides `connectedScenes`, the list of the app's scenes.

Since iOS 13, window management and the UI lifecycle have moved to `UIScene` and `UISceneDelegate`, while `UIApplicationDelegate` handles process-level events (launch, push tokens, background events). You rarely need to subclass `UIApplication`.
