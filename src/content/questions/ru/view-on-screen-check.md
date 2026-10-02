---
title: "Как проверить, что view показана на экране? Как узнать, что её добавили на экран или убрали?"
category: uikit
order: 124
---

Признак того, что view находится в иерархии окна, — `view.window != nil`. У `nil` свойства `window` нет: view ещё не добавлена или уже удалена из иерархии.

Отследить момент добавления и удаления помогают методы `UIView`:

- `willMove(toWindow:)` и `didMoveToWindow()` — view добавляется в окно или удаляется из него (в `didMoveToWindow` проверяют `window`);
- `willMove(toSuperview:)` и `didMoveToSuperview()` — смена родителя.

```swift
override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil { startAnimating() } else { stopAnimating() }
}
```

Нужно помнить, что `window != nil` не означает, что view видна пользователю: она может быть скрыта (`isHidden`, `alpha == 0`), перекрыта другим view или находиться за границами родителя. Для видимости дополнительно смотрят эти свойства и пересечение фрейма (в координатах окна) с границами окна. Для контроллера используют события появления: `viewIsAppearing`, `viewDidAppear` и `viewDidDisappear`, а также проверку `isViewLoaded && view.window != nil`.
