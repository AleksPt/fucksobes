---
title: "Why does SwiftUI use some View for views?"
category: swiftui
order: 35
---

`some View` is an opaque type: "one specific type that conforms to `View`, but we won't say which". The compiler knows it, but it is hidden from the outside.

This matters for performance: SwiftUI sees the exact structure of the hierarchy at the type level and can efficiently determine what changed instead of rebuilding everything after every edit. It also means you don't have to write cumbersome nested types like `ModifiedContent<...>` by hand.

The return type must be the same in all branches; for different types, use `@ViewBuilder`, `Group` or `AnyView`.
