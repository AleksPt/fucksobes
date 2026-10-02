---
title: "How is memory organized in iOS?"
category: memory
order: 1
---

Xcode shows the app's current and peak memory consumption. When consumption approaches the limit of the device's available memory, iOS sends a low-memory warning (`didReceiveMemoryWarning()` on `UIViewController`, `applicationDidReceiveMemoryWarning(_:)` on the app delegate, the `didReceiveMemoryWarningNotification` notification). If memory runs out faster than apps can respond, the system terminates apps to free memory, and the reason is recorded in a jetsam report.

You can examine used memory through Debug Memory Graph in Xcode (a graph node is an object, a heap allocation, or a memory-mapped file) and the Allocations instrument in Instruments, which tracks the size and number of heap and anonymous VM allocations.

