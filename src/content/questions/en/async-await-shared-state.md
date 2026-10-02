---
title: "What problems can arise if you assign data to a class variable after an async/await request? How do you avoid them?"
category: concurrency
order: 107
---

Code after an `await` can resume on **any thread** of the cooperative pool, and several tasks of the same class can run at the same time. This leads to the following problems:

- **data race**: two tasks write to a class property at the same time and the class is not isolated. In Swift 6 (strict concurrency) the compiler reports an error; in earlier modes it is a warning;
- **UI updates off the main thread** if the property is tied to the interface;
- **response ordering**: the result of an old request may arrive later and overwrite a fresh one;
- **actor reentrancy**: between `await`s the actor's state can be changed by another task, so you cannot rely on values read before the `await`.

How to avoid them:

- isolate the class or the property: `@MainActor` for a view model, a separate `actor` for shared state;
- assign the result in an isolated context rather than from an arbitrary task;
- keep the `Task` and cancel the previous one when starting a new one;
- re-check conditions after `await` and do not rely on state read earlier.

```swift
@MainActor
final class ProfileViewModel {
    private(set) var user: User?
    private var loadTask: Task<Void, Never>?

    func load() {
        loadTask?.cancel() // the old request must not overwrite the new one
        loadTask = Task {
            guard let user = try? await api.loadUser(), !Task.isCancelled else { return }
            self.user = user // runs on the main actor, so there is no race
        }
    }
}
```
