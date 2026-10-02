---
title: "What is the State pattern? How does it differ from Strategy?"
category: architecture
order: 51
---

State is a behavioral pattern: an object's behavior depends on its internal state, and each state is extracted into a separate type. The context object holds the current state and delegates calls to it, and the states themselves decide which state to move to next. This way, instead of large `switch` statements on the state, you get a set of small types.

```swift
protocol PlayerState { func tapButton(_ player: Player) }

struct Stopped: PlayerState { func tapButton(_ p: Player) { p.state = Playing() } }
struct Playing: PlayerState { func tapButton(_ p: Player) { p.state = Paused() } }
struct Paused: PlayerState { func tapButton(_ p: Player) { p.state = Playing() } }

final class Player {
    var state: PlayerState = Stopped()
    func tapButton() { state.tapButton(self) }
}
```

The difference from Strategy: the structure is similar (a context and interchangeable objects with a common interface), but the purpose is different. In Strategy, the client chooses the algorithm, and the strategies don't know about each other. In State, the states know about each other and switch the context themselves when events occur. States are often described more simply, with an `enum` and a `switch`, or with a finite state machine.
