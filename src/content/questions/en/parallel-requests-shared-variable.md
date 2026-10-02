---
title: "What happens if several network requests simultaneously save their result into one variable via the main thread?"
category: concurrency
order: 124
---

If the assignment is always performed on the main thread (`DispatchQueue.main.async`), there is no simultaneous write: the main queue is serial, and blocks run one at a time. **There will be no data race on the variable itself.**

But a **race condition in the logic** remains:

- responses arrive in arbitrary order: a slow response to an old request can overwrite a fresher result;
- a "lost update": if requests are supposed to add to a single value, but the code reads, modifies, and writes it in different places, the result depends on the order;
- if the assignment accidentally runs off the main thread (for example, in a `completion` without switching), a real data race occurs.

How to avoid it:

- cancel the previous request when starting a new one (`URLSessionTask.cancel()`, `Task.cancel()`);
- match each response to its request: store the identifier or token of the latest request and ignore stale responses;
- collect the results of parallel requests with `DispatchGroup` or `TaskGroup` and assign the final result once;
- change state only through a single isolation: the main queue, a dedicated serial queue, or `@MainActor`.

```swift
private var requestID = UUID()

func load() {
    let id = UUID()
    requestID = id                      // remember the latest request

    service.fetch { [weak self] result in
        DispatchQueue.main.async {
            guard let self, self.requestID == id else { return } // the response is stale
            self.items = result
        }
    }
}
```
