---
title: "Can UIKit (UIView and UIViewController) be used in SwiftUI?"
category: swiftui
order: 19
---

Yes. UIKit views are embedded through the `UIViewRepresentable` protocol, and UIKit view controllers through `UIViewControllerRepresentable`. In the type that adopts the protocol, you implement the methods that create, update and tear down the UIKit object, and then add it to the SwiftUI hierarchy like an ordinary view.

Changes inside the UIKit object are not passed to SwiftUI by the system. For interaction (for example, target-action and delegates), you need a `Coordinator` instance.
