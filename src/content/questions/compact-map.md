---
title: "Что такое compactMap?"
category: swift
order: 28
---

`compactMap(_:)` у `Sequence` возвращает массив непустых (не `nil`) результатов вызова переданного замыкания для каждого элемента. Его используют, когда преобразование возвращает опционал, а нужен массив неопциональных значений.

```swift
let possibleNumbers = ["1", "2", "three", "///4///", "5"]

let mapped: [Int?] = possibleNumbers.map { Int($0) }
// [1, 2, nil, nil, 5]

let compactMapped: [Int] = possibleNumbers.compactMap { Int($0) }
// [1, 2, 5]
```

Сложность — O(n), где n — длина последовательности.
