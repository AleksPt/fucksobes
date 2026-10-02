---
title: "Can a class be used as the data type for @State? Will the View be redrawn when the properties of such a class change?"
category: swiftui
order: 46
---

Formally, `@State` can hold a class too — the compiler won't forbid it. But the behavior won't be what you expect: `@State` tracks **the stored value itself**, and for a reference type the value is just a reference (pointer) to the object.

If the class has no special observation support, changing its properties **does not** trigger a redraw of the view: SwiftUI doesn't see mutations inside the object, because the reference stored in `@State` itself hasn't changed.

```swift
final class Counter {
    var value = 0
}

struct CounterView: View {
    @State private var counter = Counter()

    var body: some View {
        Button("\(counter.value)") {
            counter.value += 1 // property mutation — the View is NOT redrawn
        }
    }
}
```

For a class to work with `@State` and update the view when its properties change, it must be made observable:

- mark it with the **`@Observable`** macro (iOS 17+, the Observation framework) — then SwiftUI automatically tracks reads of each property in `body` and redraws the view when it changes, and such an object can be stored directly with `@State`;
- or, with the older approach, implement `ObservableObject` with `@Published` properties and store the object with `@StateObject` rather than `@State`.
