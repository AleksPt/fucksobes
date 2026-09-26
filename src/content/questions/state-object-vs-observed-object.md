---
title: "Чем отличается ObservedObject от StateObject?"
category: swiftui
order: 28
---

`@StateObject` — view **владеет** объектом: SwiftUI создаёт его один раз и сохраняет на всё время жизни view, даже если структура пересоздаётся. Используется для сложных локальных объектов, которые view создаёт сама.

`@ObservedObject` — view **не владеет** объектом, а только наблюдает за объектом, переданным извне. Если создать его прямо во view, он будет пересоздаваться вместе со структурой view и состояние потеряется.

```swift
struct Parent: View {
    @StateObject private var vm = ViewModel()   // создаёт и владеет

    var body: some View {
        Child(vm: vm)
    }
}

struct Child: View {
    @ObservedObject var vm: ViewModel           // получает извне
    var body: some View { Text(vm.title) }
}
```
