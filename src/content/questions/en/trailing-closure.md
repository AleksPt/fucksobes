---
title: "What is trailing closure syntax?"
category: swift
order: 138
---

If the last argument of a function is a closure, it can be written after the parentheses rather than inside them. This is syntactic sugar that makes the call more readable, especially for long closures.

```swift
func load(url: URL, completion: (Data?) -> Void) { ... }

// without a trailing closure
load(url: url, completion: { data in print(data as Any) })

// with a trailing closure
load(url: url) { data in
    print(data as Any)
}

let sorted = numbers.sorted { $0 > $1 }
```

If the closure is the only argument, the parentheses can be omitted entirely. Since Swift 5.3, multiple trailing closures are supported: the first is written without a label, and the rest with labels (`} onFailure: { ... }`). This technique is widely used in SwiftUI (`Button("OK") { ... }`, `VStack { ... }`).
