---
title: "Назовите property wrapper, которые объявляют reference семантику?"
category: swiftui
order: 26
---

Это `@ObservedObject`, `@StateObject` и `@EnvironmentObject`: они делают источником истины (source of truth) объект ссылочного типа. Для них класс должен быть наблюдаемым — соответствовать `ObservableObject` (с `@Published`-свойствами).

С iOS 17 для этого же используют макрос `@Observable` (фреймворк Observation) вместе с `@State`, `@Bindable` и `@Environment`.
