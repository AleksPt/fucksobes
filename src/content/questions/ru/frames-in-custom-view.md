---
title: "Как верстать фреймами внутри кастомной UIView?"
category: uikit
order: 100
---

Раскладку по `frame` выполняют в `layoutSubviews()`: система вызывает его, когда размер view изменился или раскладка была запрошена. В нём считают положение подвью от текущих `bounds`, а не от жёстко заданных чисел.

```swift
override func layoutSubviews() {
    super.layoutSubviews()
    let insets = safeAreaInsets
    let content = bounds.inset(by: insets)
    icon.frame = CGRect(x: content.minX + 16, y: content.midY - 12, width: 24, height: 24)
    title.frame = CGRect(x: icon.frame.maxX + 8, y: content.minY,
                         width: content.width - 48, height: content.height)
}
```

Правила: учитывать `safeAreaInsets` (и `layoutMargins`) и направление письма (`effectiveUserInterfaceLayoutDirection`) для RTL; не создавать view и не делать тяжёлых вычислений внутри метода; запрашивать пересчёт через `setNeedsLayout()`, а не вызывать `layoutSubviews()` напрямую. Для высоты по содержимому реализуют `sizeThatFits(_:)`, чтобы родитель мог узнать размер.
