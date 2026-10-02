---
title: "What happens to local objects and closures when a function has several awaits?"
category: concurrency
order: 113
---

The compiler transforms every `async` function into a **state machine**, a construct similar to generators (`yield`) in other languages. A suspension point is inserted at each `await`, and variables that are needed **after** that point are moved by the compiler from the stack frame into the **heap context** of that state machine.

The reason: between two `await` points a task can "go to sleep" and resume on a different thread, and the call stack may be reused or destroyed in the meantime, so ordinary stack memory is not suitable for state that has to survive a suspension.

```swift
func doSomething() async {
    let config = Configuration() // 1
    await fetchData()            // 2: suspension
    print(config)                 // 3: config is kept on the heap
}
```

Here `config` is stored on the heap rather than on the stack, because it is needed after the `await`. This increases storage cost and can lead to resources being held longer if closures and objects are handled carelessly.

Practical consequence: if an `async` function with several `await`s creates "heavy" objects (`Data`, `URLSession`, a `ViewModel`), they may live longer than expected, holding memory, creating retain cycles, and even causing leaks if they are not released manually.

Best practices:

- use `withXXX { }` style functions (for example, `withCheckedContinuation`, `withTaskGroup`) to explicitly limit object lifetimes to the closure's scope;
- manually nil out heavy objects when they are no longer needed:

```swift
var cache: SomeHeavyCache? = SomeHeavyCache()
await doWork()
cache = nil // release explicitly instead of waiting for the function to exit
```

- avoid strongly capturing `self` in closures inside `async` code, especially if `self` is a `UIViewController`:

```swift
await withCheckedContinuation { [weak self] continuation in
    self?.doSomething { result in
        continuation.resume(returning: result)
    }
}
```
