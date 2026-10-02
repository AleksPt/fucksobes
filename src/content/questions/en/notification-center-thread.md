---
title: "On which thread do NotificationCenter notifications fire?"
category: concurrency
order: 45
---

Usually on the one from which `post` was called.

The observer is called synchronously, on the same thread from which `post` was made. If you need a different thread (for example, the main thread to update the UI), specify a `queue` when subscribing with a block: `addObserver(forName:object:queue: .main, using:)`, and the block will then run on that queue. For subscribing with a selector and in Combine, switch to the needed queue manually (`receive(on: DispatchQueue.main)`).
