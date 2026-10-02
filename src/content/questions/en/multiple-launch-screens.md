---
title: "How many LaunchScreen storyboards can an app have? If more than one, how does the system decide which to use?"
category: uikit
order: 90
---

Several launch screens in one app are possible. By default, Xcode creates a single `LaunchScreen.storyboard`, the `UILaunchStoryboardName` key in `Info.plist` points to it, and it is shown on every launch.

If you need different screens, you add the `UILaunchScreens` dictionary to `Info.plist`: it lists the launch screens and the selection rules (`UIURLToLaunchScreenAssociations` for mapping URL schemes and `UIActivityTypeToLaunchScreenAssociations` for activity types), as well as `UILaunchScreenDefinitions`. The system picks a screen based on how the app is opened: for example, on a cold start via a particular URL scheme or a particular activity, the corresponding screen is shown, and in all other cases the default one.

In practice this is rare: more often a single universal launch screen is used.
