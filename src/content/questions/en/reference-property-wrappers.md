---
title: "Name the property wrappers that declare reference semantics."
category: swiftui
order: 26
---

These are `@ObservedObject`, `@StateObject` and `@EnvironmentObject`: they make a reference-type object the source of truth. For them, the class must be observable — it must conform to `ObservableObject` (with `@Published` properties).

Since iOS 17, the `@Observable` macro (the Observation framework) is used for the same purpose, together with `@State`, `@Bindable` and `@Environment`.
