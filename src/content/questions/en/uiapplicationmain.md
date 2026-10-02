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

Starting with Swift 5.3 (SE-0281), the entry point can be set with the **`@main`** attribute: for UIKit it is supported by `UIApplicationDelegate` (the `main()` method), and Apple's documentation names the `@main` mark as the app's entry point. `@UIApplicationMain` still works, but in the Swift 6 language mode it is marked as deprecated (the compiler suggests `@main`). This choice is unrelated to `UIScene` (iOS 13).
