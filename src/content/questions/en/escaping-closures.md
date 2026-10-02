---
title: "What are escaping and nonescaping closures? When do you need to use escaping, and why?"
category: swift
order: 23
---

A closure escapes a function when it is passed as an argument but is called after the function returns. A parameter of function type is nonescaping by default; to allow the closure to outlive the call, you write `@escaping` before the parameter type. Without this attribute, storing the closure beyond the function is a compile-time error.

Use `@escaping` when the closure is stored or called later: for example, it is appended to an array declared outside the function, or it is the completion handler of an asynchronous operation (the function returns right after starting, and the closure is called on completion).

```swift
var completionHandlers: [() -> Void] = []
func add(completionHandler: @escaping () -> Void) {
    completionHandlers.append(completionHandler)
}
```

If an escaping closure refers to `self` of a class instance, it is easy to accidentally create a strong reference cycle; that is why `self` must be written explicitly (`self.x`) or included in the capture list. A nonescaping closure can refer to `self` implicitly.

Special cases: a closure stored in a property or variable is "escaping" by default (`@escaping` is written only for function parameters). An optional closure parameter (`(() -> Void)?`) is also always considered escaping, even without the attribute: it is implicitly a value that can be stored. `@escaping` serves as a hint to the developer: the closure may run later (usually asynchronously) and captures values until the closure is released, so you need to watch out for `self` and retain cycles.
