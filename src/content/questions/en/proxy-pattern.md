---
title: "Tell me more about the Proxy pattern"
category: architecture
order: 69
---

**Proxy** is a structural pattern that substitutes a stand-in object with the same interface for the real object. The proxy intercepts calls to the original and can do something before or after passing the call to the real object, or not pass it at all.

Structure: a common service interface that is implemented both by the real **service** (the business logic) and by the **proxy** (which holds a reference to the service and decides what to do before or after delegating the call). The client works through the service interface and cannot tell the proxy from the real object.

```swift
protocol ImageLoading {
    func image() -> UIImage
}

final class RealImage: ImageLoading {
    private let url: URL
    init(url: URL) { self.url = url; loadFromDisk() } // heavy loading right away
    private func loadFromDisk() { /* ... */ }
    func image() -> UIImage { /* the already loaded image */ fatalError() }
}

// Virtual proxy: delays creating the heavy object until first access
final class LazyImageProxy: ImageLoading {
    private let url: URL
    private var real: RealImage?

    init(url: URL) { self.url = url }

    func image() -> UIImage {
        if real == nil { real = RealImage(url: url) } // create only when really needed
        return real!.image()
    }
}
```

When it is used:

- **virtual proxy**: postpone creating a "heavy" object until it is actually needed (lazy initialization);
- **protection proxy**: check access rights before letting a call through to the service;
- **remote proxy**: represent locally an object that actually lives on a remote server, translating calls into network requests;
- **logging proxy**: keep a history of requests to the service object;
- **caching proxy** (a "smart" reference): cache request results and manage their lifecycle, for example by counting references to the service object.

Pros: you can manage the lifecycle of the service object without the client noticing, and add logic before or after a call without touching the service itself.

Cons: it complicates the code with an extra layer, and a poor implementation can noticeably slow down the service's response.
