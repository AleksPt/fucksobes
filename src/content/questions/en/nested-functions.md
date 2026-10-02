---
title: "What is a nested function?"
category: swift
order: 122
---

A nested function is a function declared inside another function. It is not visible from outside and is accessible only within the body of the enclosing function, so it is convenient for extracting helper steps without cluttering the type's or file's scope.

```swift
func makeCounter() -> () -> Int {
    var count = 0
    func increment() -> Int {     // a nested function
        count += 1
        return count
    }
    return increment
}

let next = makeCounter()
next()   // 1
next()   // 2
```

A nested function can capture constants and variables of the enclosing function, like a closure, and keep using them even after the outer function has finished (in the example above, `count` lives as long as `next` does). It can be returned and passed around as a value.
