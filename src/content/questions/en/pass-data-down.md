---
title: "How can you pass data down the view hierarchy (from parent to child) using SwiftUI?"
category: swiftui
order: 15
---

Data that is only needed for reading is passed to the child view as a plain property, and for modification a `Binding` is passed: the state is declared in the parent with `@State`, and `$property` is handed to the child. For an `@Observable` object in `State`, it is enough to pass a reference to the object. If a `Binding` to its property is needed, the child view wraps the object in `@Bindable`.

```swift
struct Parent: View {
    @State private var book = Book()

    var body: some View {
        BookEditorView(book: book)
    }
}

struct BookEditorView: View {
    @Bindable var book: Book

    var body: some View {
        TextField("Title", text: $book.title)
    }
}
```

To avoid passing data through every level of the hierarchy, put the object into the environment (`environment(_:)`) and read it with `@Environment`. Apple notes that passing it as an explicit argument is convenient when the hierarchy is shallow.
