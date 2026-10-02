---
title: "Когда нужно вызывать invalidateIntrinsicContentSize()?"
category: uikit
order: 111
---

`invalidateIntrinsicContentSize()` сообщает Auto Layout, что естественный размер view изменился и его нужно запросить заново, после чего раскладка будет пересчитана.

Вызывают его в кастомных view, у которых переопределён `intrinsicContentSize`, каждый раз, когда меняется то, от чего этот размер зависит: текст, картинка, набор внутренних элементов, отступы.

```swift
final class TagView: UIView {
    var title: String = "" {
        didSet { invalidateIntrinsicContentSize() }
    }
    override var intrinsicContentSize: CGSize { ... }
}
```

Для стандартных элементов (`UILabel`, `UIButton`, `UIImageView`) вызывать метод не нужно: они делают это сами при изменении текста или изображения. Метод только помечает размер устаревшим, поэтому сам пересчёт произойдёт на следующем проходе раскладки; чтобы применить его сразу, вызывают `layoutIfNeeded()`.
