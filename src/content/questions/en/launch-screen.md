---
title: "What is LaunchScreen.storyboard? Can its elements be changed dynamically, or can it be given a handler class?"
category: uikit
order: 84
---

`LaunchScreen.storyboard` is the launch screen: the system shows it right after the icon is tapped, while the app is loading, so that there is no empty window. In the past, static images (Launch Images) were used for this; now a storyboard is used, where the layout is built with Auto Layout for any device.

Its elements cannot be changed dynamically and a handler class cannot be assigned: it is shown by the system before the app's code starts (before `main` and `application(_:didFinishLaunchingWithOptions:)`), so it is a static description that cannot execute code, and only simple elements (`UIView`, `UILabel`, `UIImageView`) are allowed, with no custom classes or logic. Starting with iOS 14, instead of a storyboard you can describe the launch screen in `Info.plist` (the `UILaunchScreen` key): background color, image and bars.

If you need an animated or dynamic screen, you show a separate controller after launch that visually repeats the launch screen.
