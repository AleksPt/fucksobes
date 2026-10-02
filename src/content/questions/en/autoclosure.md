---
title: "What is an autoclosure in Swift? How and when do you use it?"
category: swift
order: 125
---

`@autoclosure` automatically wraps the passed expression in a closure with no parameters, so no curly braces are needed when calling the function. The expression is not evaluated until the function itself calls the closure, so evaluation is deferred and may not happen at all.

```swift
func log(_ message: @autoclosure () -> String, enabled: Bool) {
    if enabled { print(message()) }
}

log("Answer: \(expensiveCalculation())", enabled: false)   // expensiveCalculation is not called
```

This is how `assert(_:_:)` and the `&&`, `||`, and `??` operators work: the right operand is evaluated only when necessary. It is used for lazy evaluation of expensive arguments and for cleaner syntax. If the closure needs to be stored, add `@escaping`. Don't overuse it: because of the deferred evaluation and the "invisible" braces, a call can confuse the reader, which is why the Swift documentation notes that it is fine to call functions that take autoclosures, but not to implement them without need.
