---
title: "Назовите property wrapper, которые объявляют value семантику?"
category: swiftui
order: 27
---

Это `@State` и `@Binding`. Только `@State` является источником истины (source of truth): view владеет этим значением, а SwiftUI хранит его между пересозданиями структуры. `@Binding` — лишь ссылка на чужое значение, которая даёт читать и изменять его.
