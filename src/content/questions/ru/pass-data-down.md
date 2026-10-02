---
title: "Как средствами SUI передавать данные по иерархии view вниз (от родительской к дочерней)"
category: swiftui
order: 15
---

Данные, которые нужны только для чтения, передают дочерней view обычным свойством, а для изменения передают `Binding`: состояние объявляют в родителе через `@State`, а в ребёнка отдают `$property`. Для `@Observable`-объекта в `State` достаточно передать ссылку на объект. Если нужен `Binding` к его свойству, дочерняя view оборачивает объект в `@Bindable`.

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

Чтобы не передавать данные через каждый уровень иерархии, объект кладут в окружение (`environment(_:)`) и читают через `@Environment`. Apple отмечает, что передача явным аргументом удобна при неглубокой иерархии.
