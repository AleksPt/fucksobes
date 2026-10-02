---
title: "What do you do when a bug report comes in (check logs and analytics, reproduce, debug)?"
category: tooling
order: 15
---

To diagnose a bug, Apple offers the Xcode debugger, the Xcode Organizer and Instruments.

If the bug was reported by users, you can get the crash report in the **Crashes** organizer in Xcode: TestFlight and the App Store collect crash reports for every submitted version, and TestFlight users share them automatically. If there isn't enough data there, the user can collect logs from the device and send them to the developer. For problems that are not crashes, look at the operating system's console log.
