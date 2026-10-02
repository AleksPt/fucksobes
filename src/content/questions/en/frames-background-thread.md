---
title: "Can you calculate frames on a background thread?"
category: uikit
order: 45
---

**You can compute** `CGRect` values **on a background thread**: it is an ordinary value-type struct that has nothing to do with UIKit. Assigning the result to `view.frame` (like changing any other view property), however, must happen only on the main thread: UIKit is not thread-safe, the Main Thread Checker reports a `-[UIView setFrame:]` call from a background thread, and in a hierarchy with Auto Layout it can end in an exception. So we compute in the background and assign in `DispatchQueue.main.async` (or on the `@MainActor`).
