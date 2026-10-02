---
title: "Что такое UISplitViewController? Для чего используется и как реализован? Какие недавние изменения в нём появились?"
category: uikit
order: 88
---

`UISplitViewController` — контейнер, который показывает несколько view controller'ов рядом друг с другом, обычно «список — детали» (например, «Почта» или «Заметки»). Он подходит для iPad и больших экранов и сам адаптируется к размеру окна: при узком окне колонки складываются в стековую навигацию.

С iOS 14 появился современный API с колонками: контроллер создают с `init(style: .doubleColumn)` или `.tripleColumn` и назначают контроллеры колонкам методом `setViewController(_:for:)` (`.primary`, `.supplementary`, `.secondary`, а также `.compact`). Колонка `.compact` показывается, когда горизонтальный size class compact (например, на iPhone), и это позволяет собрать для узкого экрана отдельный интерфейс. Режимом отображения управляют `preferredDisplayMode` и `preferredSplitBehavior` (`tile`, `overlay`, `displace`). Прежний API (`viewControllers`, `masterViewController`) считается устаревшим.
