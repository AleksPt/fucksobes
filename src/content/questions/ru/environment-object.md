---
title: "Для чего нужен EnvironmentObject?"
category: swiftui
order: 29
---

`@EnvironmentObject` нужен, когда одну модель используют во многих местах иерархии view. Объект один раз кладут в окружение через `.environmentObject(_:)`, и любой потомок получает его без передачи через инициализаторы всех промежуточных view. По сути это аналог внедрения зависимостей (DI).

```swift
ContentView()
    .environmentObject(settings)

struct Deep: View {
    @EnvironmentObject var settings: Settings
    var body: some View { Text(settings.name) }
}
```

Если объект не был помещён в окружение, приложение упадёт в рантайме при обращении к нему.
