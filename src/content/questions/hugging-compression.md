---
title: "Что такое contentHuggingPriority и contentCompressionResistancePriority?"
category: uikit
order: 79
---

Это приоритеты, которые Auto Layout использует для view с `intrinsicContentSize`, когда доступное место не совпадает с размером контента. Задаются отдельно для горизонтальной и вертикальной осей.

- `contentHuggingPriority` — насколько сильно view сопротивляется **растяжению** больше своего контента. Высокое значение: view предпочитает не расти.
- `contentCompressionResistancePriority` — насколько сильно view сопротивляется **сжатию** меньше своего контента. Высокое значение: view не даст обрезать себя.

Пример: в одной строке два `UILabel`, и места хватает только на один целиком. Если у левой метки выше compression resistance, она сохранит размер, а правая сожмётся или обрежется. Если же остаётся лишнее место, растянется метка с меньшим hugging.

```swift
label.setContentHuggingPriority(.defaultHigh, for: .horizontal)
label.setContentCompressionResistancePriority(.required, for: .horizontal)
```

Значения по умолчанию: hugging `250` (`defaultLow`), compression resistance `750` (`defaultHigh`).
