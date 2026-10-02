---
title: "Какой порядок вызова методов жизненного цикла у дочерних контроллеров в кастомном контейнере?"
category: uikit
order: 113
---

При добавлении дочернего контроллера в собственный контейнер порядок такой:

```swift
addChild(child)                       // 1. сообщаем контейнеру о ребёнке (вызывает willMove(toParent:))
view.addSubview(child.view)           // 2. добавляем view и настраиваем раскладку
child.didMove(toParent: self)         // 3. сообщаем ребёнку, что переход завершён
```

При удалении — обратный порядок:

```swift
child.willMove(toParent: nil)
child.view.removeFromSuperview()
child.removeFromParent()              // вызовет didMove(toParent: nil)
```

События появления (`viewWillAppear`, `viewDidAppear` и т. д.) контейнер передаёт детям автоматически. Если нужно управлять этим вручную (например, при анимированной замене одного дочернего контроллера другим), переопределяют `shouldAutomaticallyForwardAppearanceMethods` и сами вызывают `child.beginAppearanceTransition(_:animated:)` и `child.endAppearanceTransition()`: первый посылает `viewWillAppear/viewWillDisappear`, второй — `viewDidAppear/viewDidDisappear`.
