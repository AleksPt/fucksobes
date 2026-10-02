---
title: "How do you test an app without a physical device?"
category: tooling
order: 37
---

The main way is the **iOS Simulator** from Xcode: it runs the app on a Mac for different iPhone and iPad models and iOS versions, lets you change the screen size, orientation, dark mode, language, font size and location, and simulate gestures, a low-memory warning and sending push notifications (via an `.apns` file). It is fast and suitable for UI and unit tests, including in CI.

Simulator limitations: no camera, Bluetooth, real sensors, Face ID or Touch ID (emulation only), different performance and memory (it uses the Mac's processor and memory), and some APIs behave differently. So the final check has to be done on a real device.

Additional options: SwiftUI Previews for quickly checking screens, cloud device farms (Firebase Test Lab, BrowserStack, AWS Device Farm) for running on real phones, and TestFlight for having testers check the build.
