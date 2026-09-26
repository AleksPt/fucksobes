---
title: "Что такое trailing closure syntax?"
category: swift
order: 138
---

Если последний аргумент функции — замыкание, его можно записать после круглых скобок, а не внутри них. Это синтаксический сахар, который делает вызов читаемее, особенно для длинных замыканий.

```swift
func load(url: URL, completion: (Data?) -> Void) { ... }

// без trailing closure
load(url: url, completion: { data in print(data as Any) })

// с trailing closure
load(url: url) { data in
    print(data as Any)
}

let sorted = numbers.sorted { $0 > $1 }
```

Если замыкание — единственный аргумент, скобки можно опустить совсем. С Swift 5.3 поддерживаются несколько trailing closures: первое пишут без метки, а остальные с метками (`} onFailure: { ... }`). Этот приём широко применяется в SwiftUI (`Button("OK") { ... }`, `VStack { ... }`).
