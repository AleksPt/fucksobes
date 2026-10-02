---
title: "What does UIApplicationMain mean?"
category: uikit
order: 151
---

`UIApplicationMain` is an attribute (`@UIApplicationMain`) and a C function of the same name that used to be the **entry point** of a UIKit-based iOS app.

What it does at launch:

- creates an instance of `UIApplication` (or the specified custom subclass) and makes it `UIApplication.shared`;
- creates an instance of the app delegate and assigns it to `UIApplication.delegate`;
- starts the main **run loop**, which processes events and keeps the app alive until it terminates.

`@UIApplicationMain` was placed before the `AppDelegate` class and replaced a manual `main.swift` with an explicit call to `UIApplicationMain(_:_:_:_:)`, passing the `UIApplication` and delegate class names as strings.

```swift
// A main.swift file equivalent to @UIApplicationMain
import UIKit

UIApplicationMain(
    CommandLine.argc,
    CommandLine.unsafeArgv,
    nil,                              // the default UIApplication class
    NSStringFromClass(AppDelegate.self)
)
```

Starting with iOS 13 and the arrival of `UIScene`, and then with the **`@main`** attribute shared by UIKit and SwiftUI, `@UIApplicationMain` is considered an outdated approach: `@main` works uniformly for any entry point and lets you describe the app's structure declaratively, including through `UIApplicationDelegateAdaptor` in SwiftUI projects.
