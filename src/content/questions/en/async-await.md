---
title: "Async/await"
category: concurrency
order: 72
---

`async` marks a function that can suspend and resume later; `await` marks every possible suspension point at the call site. Suspension is never implicit or preemptive: code can suspend only where it calls another asynchronous function.

```swift
let photoNames = await listPhotos(inGallery: "Summer Vacation")
let photo = await downloadPhoto(named: photoNames[0])
show(photo)
```

While the code waits at an `await`, the rest of the program keeps running. After resumption, Swift does not guarantee which thread the function continues on.
