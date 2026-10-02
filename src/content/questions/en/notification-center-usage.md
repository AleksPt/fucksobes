---
title: "How do you use NotificationCenter to pass data between objects?"
category: architecture
order: 47
---

`NotificationCenter` is a central notification "bus" (an implementation of the Observer pattern): one object publishes an event by name, and any number of others are subscribed to it. The sender and the receivers don't know about each other.

```swift
extension Notification.Name {
    static let userDidLogin = Notification.Name("userDidLogin")
}

// subscribing
let token = NotificationCenter.default.addObserver(
    forName: .userDidLogin, object: nil, queue: .main
) { note in
    let user = note.userInfo?["user"] as? User
}

// publishing
NotificationCenter.default.post(name: .userDidLogin, object: self, userInfo: ["user": user])
```

Data is passed in `userInfo` (a dictionary) or in `object`. A block-based subscription must be removed with `NotificationCenter.default.removeObserver(token)`; otherwise it stays alive, and the closure can create a retain cycle (use `[weak self]`). For selector-based subscriptions, since iOS 9 you don't have to unsubscribe when the object is deallocated. There are also modern options: `NotificationCenter.default.publisher(for:)` in Combine and `notifications(named:)` as an `AsyncSequence`.

Pros: loose coupling and many receivers. Cons: the connections are implicit, there is no type checking (the `userInfo` keys are strings), and the data flow is harder to trace and debug. That is why notifications are used for broadcast events (the keyboard, a theme change, a user logging in or out), while delegates and closures are used to connect two specific objects.
