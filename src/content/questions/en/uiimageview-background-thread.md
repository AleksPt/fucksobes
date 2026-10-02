---
title: "We have a UIImageView and need to set an image on it. Can this be done from a background thread? Will the image be set?"
category: uikit
order: 154
---

Formally, the image **will be set**: the assignment `imageView.image = someImage` from a background thread does not crash and is not ignored; the `image` property is an ordinary property with no protection against writes from off the main thread.

But doing so is **strongly discouraged**. All UI drawing in UIKit must happen on the main thread: once the new `image` value gets into the rendering queue, the system has to redraw the `UIImageView`, and rendering and work with layers (`CALayer`) are not thread-safe. Setting an image from a background thread can lead to:

- visual artifacts or a delay in the screen update (the redraw may not happen right away, but out of sync with the rest of the UI);
- data races, if properties of the same view are being read or changed from the main thread at the same moment;
- unpredictable crashes later on, not necessarily at the moment of the assignment itself but somewhere further down the Core Animation call stack, which makes debugging harder.

The right approach is to load/decode the image in the background and always move the assignment to the `UIImageView` to the main thread:

```swift
DispatchQueue.global(qos: .userInitiated).async {
    let image = loadAndDecodeImage(from: url) // heavy work happens in the background

    DispatchQueue.main.async {
        imageView.image = image // while setting it in the UI happens on the main thread
    }
}
```

The same rule applies to any other access to `UIView` and its subclasses, not just `UIImageView`.
