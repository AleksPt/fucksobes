---
title: "List all the lazy containers in SwiftUI"
category: swiftui
order: 37
---

Lazy containers are those that create and show items as needed rather than all at once when they appear: this saves memory and time on large data sets.

- `List` — a scrollable list of rows;
- `LazyVStack` and `LazyHStack` — lazy versions of the stacks, usually used inside a `ScrollView`;
- `LazyVGrid` and `LazyHGrid` — grids whose cells are created as you scroll;
- `Table` — a table with columns (iPadOS, macOS).

Regular `VStack`, `HStack` and `ForEach` are not lazy on their own: `VStack` creates all of its children at once, and `ForEach` is lazy only when it sits inside a lazy container. Lazy containers pay off with hundreds or thousands of items, while for a short list (a few items) a regular stack is enough.
