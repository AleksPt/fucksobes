---
title: "Какие состояния сцены есть в SwiftUI и как их отслеживать (scenePhase)?"
category: swiftui
order: 39
---

Сцена (scene) в SwiftUI может находиться в одном из трёх состояний `ScenePhase`:

- `active` — сцена на экране, и пользователь может с ней взаимодействовать;
- `inactive` — сцена видна, но не принимает ввод (например, во время перехода, в переключателе приложений или при системном диалоге);
- `background` — сцена не отображается, приложение работает в фоне и вскоре может быть приостановлено или завершено.

Текущее состояние читают из окружения и реагируют на изменения через `onChange`:

```swift
struct RootView: View {
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        ContentView()
            .onChange(of: scenePhase) { _, newPhase in
                if newPhase == .background { saveState() }
            }
    }
}
```

Значение из `View` описывает сцену, в которой находится представление, а из `App` — агрегированное состояние всех сцен. Обычно в `background` сохраняют данные, а в `active` возобновляют работу. Это замена методам `UIApplicationDelegate` и `UISceneDelegate` из UIKit.
