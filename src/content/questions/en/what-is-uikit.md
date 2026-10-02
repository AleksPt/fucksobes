---
title: "What is UIKit?"
category: uikit
order: 76
---

UIKit is Apple's framework for building app interfaces on iOS, iPadOS and tvOS (on macOS, AppKit plays the same role). It is imperative: views are created, configured and added to the hierarchy by hand or in Interface Builder.

It provides:

- app infrastructure: `UIApplication`, `UIScene`, `UIWindow`, the lifecycle;
- the `UIView` hierarchy, layout with Auto Layout, and drawing;
- controllers: `UIViewController`, navigation (`UINavigationController`, `UITabBarController`), lists (`UITableView`, `UICollectionView`);
- event handling: touches, gestures, the responder chain;
- animations (`UIView.animate`) on top of Core Animation, support for Dynamic Type, dark mode and accessibility.

UIKit is used in most existing apps. The modern alternative is declarative SwiftUI, but it often works together with UIKit through `UIViewRepresentable` and `UIHostingController`.
