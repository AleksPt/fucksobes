---
title: "What is a completion handler for in Swift?"
category: swift
order: 124
---

A completion handler is a closure that is passed to a function and that the function calls when it finishes its work. It is needed for asynchronous operations (a network request, a file download, an animation) whose result cannot be returned from the function immediately: the calling code is not blocked, and the continuation receives the result later.

```swift
func fetchUser(id: Int, completion: @escaping (Result<User, Error>) -> Void) {
    URLSession.shared.dataTask(with: url(id)) { data, _, error in
        // parse the response...
        completion(.success(user))
    }.resume()
}

fetchUser(id: 1) { result in
    // runs when the download completes
}
```

The closure is marked `@escaping` because it is called after the function returns. It is important to call it exactly once on every execution path and to consider which thread it will be called on (UI updates are done on the main thread). Today many tasks are solved with `async/await`, while the completion handler remains in many Apple APIs and in legacy code, and can be turned into an `async` function with `withCheckedContinuation`.
