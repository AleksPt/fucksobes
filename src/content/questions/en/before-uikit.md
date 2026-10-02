---
title: "What was there before UIKit?"
category: uikit
order: 145
---

UIKit appeared together with the first iPhone SDK: iPhone OS 1.0 (2007) shipped without third-party apps (developers were offered web apps for Safari), and the SDK and the App Store arrived with iPhone OS 2.0 (2008).

UIKit was built on ideas from Apple's desktop frameworks: AppKit and Foundation from Cocoa for macOS, which trace back to NeXTSTEP (Objective-C, Interface Builder, the MVC and delegation patterns). AppKit was not suitable for a mobile device, so a lightweight framework had to be created for touch input, limited resources and Core Animation. That is why the mobile stack is called Cocoa Touch (UIKit, Foundation, Core Animation, etc.).

The conceptual predecessors were AppKit (macOS, NeXTSTEP) and, before them, Carbon and the Toolbox on classic Mac OS. SwiftUI (2019) later appeared as a declarative alternative, but a lot of the iOS platform still runs on UIKit.
