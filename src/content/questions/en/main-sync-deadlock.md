---
title: "What happens if you call DispatchQueue.main.sync() inside viewDidLoad() in GCD?"
category: concurrency
order: 21
---

A **deadlock** will occur: `viewDidLoad()` runs on the main queue, and `DispatchQueue.main.sync` can only be called when you are not on it.
