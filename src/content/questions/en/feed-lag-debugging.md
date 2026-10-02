---
title: "You are given an app with an unfamiliar codebase. You have access to the code and you are opening the project for the first time. You build it, run it and start scrolling. The app is a news feed made of cells of different heights. A cell may or may not have an image, and may contain text of varying dynamic height. You use it and realize it lags terribly. Where would you start and how would you approach debugging it?"
category: uikit
order: 68
---

1. **Profiling.** Tools such as Instruments in Xcode let you analyze performance: CPU, memory and other resources in real time. Start with Time Profiler to find the code that loads the main thread the most, since the main thread is where all UI work happens.
2. **Common causes of slow scrolling:**
    - **Network requests on the main thread.** Perform them asynchronously so they do not block the UI.
    - **Graphics operations such as rounding corners with** `layer.cornerRadius`. Despite the optimizations after iOS 9, they can still be expensive, especially if applied to many elements on the screen.
    - **Shadows with** `layer.shadow`. They can slow rendering down significantly, especially without an optimization such as `shadowPath`.
3. **Optimization:**
    - **Lazy loading of images and data:** load them only when they are needed.
    - **Animation optimization:** complex transitions and animations should not overload the main thread.
    - **Lightweight alternatives to complex views:** replace standard views with simpler ones or, if possible, draw them with Core Graphics.
