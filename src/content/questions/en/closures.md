---
title: "What is a closure?"
category: swift
order: 20
---

A closure is a self-contained block of code that can be passed around and used in a program; it is the analog of lambdas and blocks in other languages. A closure can capture and store references to constants and variables from the context in which it is defined (closing over); Swift handles all the related memory management for you.

There are three kinds of closures: global functions, nested functions, and closure expressions (unnamed closures). Closures are reference types: when you assign a closure to a variable, you store a reference to it.

```swift
let sorted = [3, 1, 2].sorted { $0 < $1 }
```
