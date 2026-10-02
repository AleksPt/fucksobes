---
title: "What is the difference between ObservedObject and StateObject?"
category: swiftui
order: 28
---

`@StateObject` — the view **owns** the object: SwiftUI creates it once and keeps it for the entire lifetime of the view, even if the struct is recreated. It is used for complex local objects that the view creates itself.

`@ObservedObject` — the view **does not own** the object and only observes an object passed in from outside. If you create it directly in the view, it will be recreated along with the view struct and the state will be lost.

```swift
struct Parent: View {
    @StateObject private var vm = ViewModel()   // creates and owns

    var body: some View {
        Child(vm: vm)
    }
}

struct Child: View {
    @ObservedObject var vm: ViewModel           // receives from outside
    var body: some View { Text(vm.title) }
}
```
