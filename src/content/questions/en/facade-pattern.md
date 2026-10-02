---
title: "Tell me more about the Facade pattern"
category: architecture
order: 67
---

**Facade** is a structural pattern that hides the complexity of a subsystem behind a single simplified interface.

As a system grows, it ends up with many classes that must be initialized correctly in the right order and made to work with each other. Having every piece of client code know all these details is inconvenient and fragile. The facade takes this complexity on itself: it "knows" which subsystem objects to pass a request to, and in what order, while the client talks only to the facade.

```swift
// A subsystem of several classes, each with its own setup details
final class AudioDecoder { func prepare() { } }
final class VideoRenderer { func prepare() { } }
final class NetworkBuffer { func connect() { } }

// The facade hides their joint setup behind one simple method
final class VideoPlayerFacade {
    private let audio = AudioDecoder()
    private let video = VideoRenderer()
    private let buffer = NetworkBuffer()

    func play(url: URL) {
        buffer.connect()
        audio.prepare()
        video.prepare()
        // ... start playback
    }
}

let player = VideoPlayerFacade()
player.play(url: someURL) // the client knows nothing about Decoder/Renderer/Buffer
```

When it is used:

- you need to give a simple interface to a complex subsystem that gets more complicated as the project grows;
- you want to split the system into layers and define entry points to each level, so that subsystems communicate only through facades rather than directly.

Pros: it isolates clients from the details of a complex subsystem, and changes inside the subsystem do not affect client code as long as the facade's public interface stays the same.

Cons: a facade risks turning into a "god object" that knows too much about every part of the system. If it starts to grow, it is better to create several narrower facades instead of one.
