---
title: "How many LaunchScreen storyboards can an app have? If more than one, how does the system decide which to use?"
category: uikit
order: 90
---

Several launch screens in one app are possible. By default, Xcode creates a single `LaunchScreen.storyboard`, the `UILaunchStoryboardName` key in `Info.plist` points to it, and it is shown on every launch.

If you need different screens, you set the `UILaunchStoryboards` dictionary in `Info.plist` instead of `UILaunchStoryboardName`: `UILaunchStoryboardDefinitions` is an array of dictionaries with `UILaunchStoryboardIdentifier` and `UILaunchStoryboardFile` (an identifier and a storyboard or xib file), `UIURLToLaunchStoryboardAssociations` maps the URL schemes from `CFBundleURLTypes` to those identifiers, and `UIDefaultLaunchStoryboard` is the identifier of the default screen. The system picks a screen based on the URL scheme the app is launched with, and in all other cases shows the default one. For screens without a storyboard there is an analog: `UILaunchScreens` with `UILaunchScreenDefinitions`, `UIURLToLaunchScreenAssociations` and `UIDefaultLaunchScreen`.

In practice this is rare: more often a single universal launch screen is used.
