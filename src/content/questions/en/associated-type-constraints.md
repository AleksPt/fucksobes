---
title: "What restrictions apply to protocols with an associated type?"
category: swift
order: 99
---

A protocol with an `associatedtype` (or a `Self` requirement) is a "generic" protocol, so it cannot be used as an ordinary concrete type without further specification:

```swift
protocol Container { associatedtype Item; func get() -> Item }

var c: Container            // an error before Swift 5.7; allowed now, but with a warning
var c: any Container        // Swift 5.7+ — an "existential" type
```

Before Swift 5.7 (SE-0309), such a protocol could only be used as a generic constraint (`func f<C: Container>(c: C)`). The compiler still accepts the form without `any` with a warning (it will become an error in a future language mode). Now it can also be used as `any Container` (losing information about `Item`: values come back as `Any` or require a cast), and as `some Container` for an opaque return type or parameter. Starting with Swift 5.7 you can also specify primary associated types: `any Collection<Int>`.

Other consequences: you cannot store a homogeneous list of different implementations with different `Item` types without type erasure (for example, `AnyPublisher`), and it is harder to use such protocols in mocks.
