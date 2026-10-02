---
title: "ForEach(array, id: \\.self) crashes with an error about duplicate ids, but the business requirements say the strings may repeat. How do you solve it?"
category: swiftui
order: 47
---

The crash doesn't always happen — SwiftUI really does require the `id` of each `ForEach` element to be unique (otherwise it can't correctly match old and new elements on update and build a diff). `id: \.self` uses the string value itself as the identifier, so as soon as the array contains two equal values, the identifiers collide and everything breaks.

Since repeated values are expected behavior rather than a bug, the id must distinguish elements **not by content** but by their **position/origin**, instead of being equal to the value itself.

Solutions:

- **Wrap the value in a struct with its own unique id**, where the string is just one of the properties:

```swift
struct Row: Identifiable {
    let id = UUID()
    let title: String
}

let rows = array.map { Row(title: $0) }

ForEach(rows) { row in
    Text(row.title)
}
```

- **Use the index as part of the identifier**, if the order is stable and elements are not reordered or removed from the middle of the list:

```swift
ForEach(Array(array.enumerated()), id: \.offset) { index, title in
    Text(title)
}
```
This approach is simpler but less safe for animations and reordering — when an element is removed from the middle, SwiftUI may "rebind" state to the wrong element because the indices of the remaining rows shift.

The first option (a wrapper with a `UUID`) is preferable: it gives a stable identity that depends neither on the content nor on the position in the array, and it works correctly with insertion/removal animations.
