---
title: "Is the main function the earliest point at which we can run our code?"
category: uikit
order: 72
---

No. Some code runs before `UIApplicationMain` is called: Apple explicitly mentions methods that the system calls automatically before `main`, such as `load()`. Heavy code in them slows down launch, so it is recommended to minimize the work done before `UIApplicationMain`.

In addition, the system may perform prewarming: it creates the process and loads the libraries the app references, after which the process is suspended without executing any of the app's code.
