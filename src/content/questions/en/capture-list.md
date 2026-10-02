---
title: "Tell me about capturing values in a closure. Why do it, how, and which keywords can be used?"
category: swift
order: 25
---

A closure can capture constants and variables from the surrounding context and use them even after the original scope no longer exists. By default, a closure captures values from the outer scope with strong references. A capture list lets you control this explicitly: it is written in square brackets before the parameter list, and when it is present, the `in` keyword is required.

The list items are initialized at the moment the closure is created: for each one, a constant is created with the value of the variable of the same name from the outer scope. So the closure does not see later changes to the outer variable, but it does see the current value of a variable that has no entry in the list:

```swift
var a = 0
var b = 0
let closure = { [a] in print(a, b) }
a = 10
b = 10
closure() // 0 10
```

For classes, an item can be marked `weak` or `unowned` to capture a weak or unowned reference instead of a strong one. This is needed to break a strong reference cycle between an object and a closure (for example, `[weak self]`, `[unowned self, weak delegate = self.delegate]`). `weak` is appropriate when the captured object may be deallocated earlier (the reference becomes `nil`), `unowned` when its lifetime is the same or longer; accessing an `unowned` object that has already been deallocated causes a runtime error. An explicit `[self]` means a strong capture of `self` that states the intent explicitly.
