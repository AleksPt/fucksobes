---
title: "In what ways can an app be launched?"
category: uikit
order: 73
---

The user launches an app by tapping its icon on the Home Screen. In addition, if the app has requested certain events (for example, it supports one of the Background Modes capabilities), the system may launch it in the background to handle those events: the app goes straight to the `Background` state rather than to the foreground.

The reason for the launch can be determined: when using scenes, UIKit passes a `ConnectionOptions` object to `scene(_:willConnectTo:options:)` (for example, a request to open a `URL`); without scenes, it passes the `launchOptions` dictionary in `application(_:didFinishLaunchingWithOptions:)`. The dictionary contains keys only for the capabilities the app supports.
