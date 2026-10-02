---
title: "What is CADisplayLink? What is it used for?"
category: uikit
order: 91
---

`CADisplayLink` is a timer synchronized with the screen refresh rate. It calls the given selector before each frame is drawn (60 or 120 times per second on ProMotion), so it is suitable for frame-by-frame animation, games, custom drawing and smooth counters.

```swift
let link = CADisplayLink(target: self, selector: #selector(step))
link.preferredFrameRateRange = CAFrameRateRange(minimum: 30, maximum: 60)
link.add(to: .main, forMode: .common)

@objc func step(_ link: CADisplayLink) {
    let dt = link.targetTimestamp - link.timestamp   // time until the next frame
}
```

The `timestamp` and `targetTimestamp` properties give the time of the current and the next frame, which lets you animate based on time rather than frame count. To save battery, limit the frame rate (`preferredFrameRateRange`) and stop the timer with `invalidate()` or `isPaused`. `CADisplayLink` holds a strong reference to its `target`, so you need to call `invalidate()` in advance or use a proxy object, otherwise you get a retain cycle. It differs from a regular `Timer` in that it is tied to screen frames rather than to an arbitrary time interval.
