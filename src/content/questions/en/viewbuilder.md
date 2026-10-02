---
title: "What is @ViewBuilder? What problems can it introduce?"
category: swiftui
order: 52
---

`@ViewBuilder` is a **result builder** (the `@resultBuilder` attribute) that lets you write a list of views one after another in a declarative block (as in `body`) and automatically assembles them into a single composite view, instead of requiring an explicit array or a manual wrapper.

```swift
@ViewBuilder
func content(isLoggedIn: Bool) -> some View {
    if isLoggedIn {
        ProfileView()
    } else {
        LoginView()
    }
}
```

The compiler turns such a block into calls to the static methods of `ViewBuilder` (`buildBlock`, `buildEither(first:)`/`buildEither(second:)` for `if/else`, `buildOptional` for `if` without `else`, and so on), which wrap the listed views in hidden types like `TupleView` or `_ConditionalContent` — which is exactly why `body` can be written without an explicit `return` and without building an array by hand.

Problems it can introduce:

- **A limit of 10 elements** in a single block — a historical limitation of older SDKs, where `buildBlock` was overloaded for a fixed number of arguments; exceeding it caused a compile error, and you had to group some of the views with `Group` or extract them into a subview. In modern SDKs `buildBlock` is variadic (parameter packs), and there is no such limit.
- **Each branch changes the actual return type** — `if/else` becomes `_ConditionalContent<TrueView, FalseView>`, which bloats the type, can slow down compilation of complex `body`s, and makes type error messages harder to read.
- **Only expressions that return a View** — inside a `@ViewBuilder` block you can't write arbitrary imperative code (`for` loops without `ForEach`, `print`, assignments) — the compiler will tell you so, but it often surprises newcomers.
- **Implicit conversions complicate debugging** — it isn't always obvious what exactly `some View` resolves to with nested conditions, which makes explicit typing harder if it suddenly becomes necessary (for example, for a protocol with an associated type).
