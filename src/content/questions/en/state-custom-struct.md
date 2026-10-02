---
title: "Can a custom struct be used as the data type for @State? Will the View be redrawn when the properties of such a struct change?"
category: swiftui
order: 45
---

Yes, it can — `@State` is designed precisely for value types, and a custom `struct` suits it even better than a class.

The View will be redrawn when **any** property of such a struct changes. The reason is value semantics: the struct is stored in the `@State` storage as a whole, and when any of its properties is mutated (`state.title = "..."`), a new value of the struct is created and written back into the storage in full. SwiftUI sees that the value has changed and re-evaluates `body`.

```swift
struct FormState {
    var name: String = ""
    var isValid: Bool = false
}

struct FormView: View {
    @State private var form = FormState()

    var body: some View {
        TextField("Name", text: $form.name) // changes form.name → a new FormState value
    }
}
```

Important: the change must go through the `@State` property itself (directly or via a `Binding` obtained from `$form`), not through a separate copy of the struct obtained, for example, from an array without writing it back — otherwise SwiftUI won't learn about the change.
