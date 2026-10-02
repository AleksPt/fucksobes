---
title: "What is async let? How does it differ from a regular async/await sequence?"
category: concurrency
order: 84
---

`async let` starts a child task in parallel with the current code and immediately returns control; the result is obtained later with `await`. With the regular form `let a = await f()`, the next line runs only after `f()` finishes, that is, sequentially.

```swift
async let user = fetchUser()
async let posts = fetchPosts()
let (u, p) = try await (user, posts)  // both loads ran at the same time
```

`async let` gives parallelism for a known number of independent operations. This is structured concurrency: child tasks cannot outlive their scope, and if you leave the scope before the `await`, they are implicitly cancelled and awaited. For a variable number of tasks, use `TaskGroup`.
