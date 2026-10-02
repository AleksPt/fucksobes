---
title: "What is EnvironmentObject for?"
category: swiftui
order: 29
---

`@EnvironmentObject` is needed when a single model is used in many places of the view hierarchy. You put the object into the environment once with `.environmentObject(_:)`, and any descendant gets it without passing it through the initializers of all the intermediate views. Essentially, it is a form of dependency injection (DI).

```swift
ContentView()
    .environmentObject(settings)

struct Deep: View {
    @EnvironmentObject var settings: Settings
    var body: some View { Text(settings.name) }
}
```

If the object was not placed in the environment, the app crashes at runtime when it tries to access it.
