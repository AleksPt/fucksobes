---
title: "App lifecycle states. How can we track state transitions?"
category: uikit
order: 70
---

States are tracked using the `AppDelegate`/`SceneDelegate` methods and `NotificationCenter`.

Initially the app is not running (`Not running`). After the user launches it, it moves to the foreground (`Foreground`) and first becomes `Inactive`: code is executing, but UI events are not processed (touches are not accepted). Then the app moves to `Active`: code is executing and all UI events are processed. If the user minimizes the app or switches to another one, it becomes `Inactive` again and then goes to `Background`: code runs for a limited time (without an additional request), and UI events are not processed. Then the app moves to `Suspended`: no code is executing, and the system may terminate the app on its own to free memory.

**States**

1. **Not running**: the app is not launched and is not in memory.
2. **Inactive**: the app is in the foreground but is not receiving events. This happens when user interaction is temporarily interrupted, for example by an incoming call, an SMS or a notification.
3. **Active**: the app is in the foreground and receives user input. This is the main working state.
4. **Background**: the app runs in the background and executes code: a background task, finishing up, or downloading content.
5. **Suspended**: the app is in memory, but code execution is stopped. The system may reclaim resources and terminate the app.

**Key `UIApplicationDelegate` methods**

- `application(_:didFinishLaunchingWithOptions:)`: app launch;
- `applicationDidBecomeActive(_:)`: transition to the active state;
- `applicationWillResignActive(_:)`: transition to the inactive state;
- `applicationDidEnterBackground(_:)`: transition to the background;
- `applicationWillEnterForeground(_:)`: returning from the background;
- `applicationWillTerminate(_:)`: app termination.
