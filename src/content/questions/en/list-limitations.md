---
title: "You have an array of data to display as a table, but the standard List styles can't match the design exactly. What can you replace List with to get around its limitations?"
category: swiftui
order: 48
---

`List` is convenient out of the box (cell reuse, swipe actions, standard separators), but it imposes a system style: its own row insets, background, separators and selection behavior, which are not always easy to override for a non-standard design — even `.listRowInsets`, `.listRowBackground` and `.listStyle(.plain)` don't remove all the system quirks completely.

The replacement is **`ScrollView` + `LazyVStack`**:

```swift
ScrollView {
    LazyVStack(spacing: 0) {
        ForEach(items) { item in
            RowView(item: item)
        }
    }
}
```

What this gives you:

- full control over insets, background, separators and any other aspect of the row's appearance — it is laid out like an ordinary view, without system styles;
- `LazyVStack` keeps lazy loading — cells are created only when they enter the scrolling area, just like in `List`, so performance on large lists doesn't suffer;
- on the other hand, you lose the things that come out of the box: swipe actions, `onDelete`/`onMove`, standard section navigation — you will have to implement them manually with gestures and modifiers.

If the layout constraints are not critical but some specific system details are annoying, it is sometimes enough to customize the existing `List` with `.listRowInsets(EdgeInsets())`, `.listRowSeparator(.hidden)`, `.listRowBackground(Color.clear)` and `.listStyle(.plain)` without abandoning it entirely.
