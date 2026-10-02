---
title: "What do you do when a bug report comes in (check logs and analytics, reproduce, debug)?"
category: tooling
order: 15
---

The usual order is:

1. **Reproduce it.** Clarify the steps, the app and OS versions and the device; without a reproduction it is unclear what exactly to fix and how to verify the fix.
2. **Collect data: logs and analytics.** Look at crash reports and metrics (the Organizer, below) and at logs; builds from the App Store and TestFlight can't be debugged in Xcode, so diagnosis relies on crash reports and device logs.
3. **Find the cause with the debugger.** For this Apple offers the Xcode debugger (breakpoints, LLDB) and Instruments; once found, the bug is worth covering with a test so it doesn't come back.

If the bug was reported by users, you can get the crash report in the **Crashes** organizer in Xcode: TestFlight and the App Store collect crash reports for every submitted version, and TestFlight users share them automatically. If there isn't enough data there, the user can collect logs from the device and send them to the developer. For problems that are not crashes, look at the operating system's console log.
