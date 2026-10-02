---
title: "What is an actor hop and how do you minimize the overhead of actor-to-actor messages?"
category: concurrency
order: 118
---

An **actor hop** is a switch of execution from one actor to another. It happens when:

- you call a method of one `actor` from the context of another `actor`;
- or you call an actor's method from a context with no actor (for example, `Task.detached`).

Each such switch is not a free operation. It involves:

- a **context transition**: the actor scheduler puts the task into its own queue;
- **suspension** of the current task (`await`);
- **scheduling** on a different actor executor.

```swift
actor FirstActor {
    let second = SecondActor()

    func doSomething() async {
        await second.work() // ← actor hop
    }
}

actor SecondActor {
    func work() async {
        print("Doing work")
    }
}
```

Here `FirstActor` makes an actor hop to `SecondActor`.

Why it matters:

- every hop is a potential suspend-resume, even if the code itself is short;
- it is more expensive than a regular function call (even `await sleep()` is faster than a single hop because of the constant context-switching overhead);
- many actor hops on a hot path (for example, during scroll-view updates, ML inference, or in a dependency graph) lead to a noticeable slowdown.

How to optimize:

- **group calls to the same actor** into a single method instead of several separate `await`s:

```swift
await secondActor.doMultipleThings() // better than 3 separate awaits
```

- **pass data rather than making actors request it from each other**:

```swift
await dataProcessor.process(data) // pass the data, not a context to request it
```

- **avoid cascading hops**, where one actor calls another inside its method and that one calls a third:

```swift
await actorA.callActorB { await actorC.work() } // ❌ triple hop
```

**Advanced.** For performance-critical code, use `nonisolated` methods inside an actor:

```swift
actor Processor {
    nonisolated func staticMethod() -> Int {
        42
    }
}
```

Such methods do not hop (they do not switch execution to the actor executor), but they also have no access to isolated state (`self`), so they suit only utility functions and constants that do not depend on the actor's state.
