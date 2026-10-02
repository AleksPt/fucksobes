---
title: "Tell me about the Observation framework"
category: swiftui
order: 13
---

Observation is a Swift framework that implements the observer pattern: an observable object notifies observers about state changes without a tight coupling between them. A type is declared observable with the `@Observable` macro, and change tracking is performed by `withObservationTracking(_:onChange:)`. Only the properties read inside the closure are tracked.

In SwiftUI, a view depends on the properties of an `@Observable` object that it reads in `body`, and is updated only when they change. This differs from `ObservableObject`, where a view is updated when any `@Published` property changes, even one that `body` doesn't read. In addition, `@Published` is not needed, and `State` and `Environment` are used instead of `StateObject`/`EnvironmentObject`. A property that doesn't need to be tracked is marked `@ObservationIgnored`. If a view needs a `Binding` to a property, the object is wrapped in `@Bindable`.

Available since iOS 17, macOS 14.
