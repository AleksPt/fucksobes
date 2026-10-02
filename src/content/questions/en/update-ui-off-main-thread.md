---
title: "In what case can you update the UI off the main thread?"
category: concurrency
order: 15
---

Practically never: all user interface changes in iOS must happen on the main thread. Trying to update the UI on another thread leads to unpredictable behavior or an app crash. The only exception in the `UIView` documentation is creating the view object itself; everything else you do with it happens on the main thread. Heavy work (loading, decoding, preparing data) is done in the background, and the result is passed to the UI on the main thread.
