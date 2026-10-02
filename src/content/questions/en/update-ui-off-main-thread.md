---
title: "In what case can you update the UI off the main thread?"
category: concurrency
order: 15
---

You can't: all user interface changes in iOS must happen strictly on the main thread. Trying to update the UI on another thread leads to unpredictable behavior or an app crash.
