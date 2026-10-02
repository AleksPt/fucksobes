---
title: "Что будет, если забыть выключить translatesAutoresizingMaskIntoConstraints?"
category: uikit
order: 96
---

По умолчанию для view, созданных в коде, свойство `translatesAutoresizingMaskIntoConstraints` равно `true`: система превращает `frame` и autoresizing mask в собственные констрейнты этой view. Если добавить к такой view ещё и свои констрейнты, они начнут конфликтовать с автоматическими.

Результат: в консоли предупреждение «Unable to simultaneously satisfy constraints», а система ломает один из констрейнтов; view может оказаться не там или иметь не тот размер, а иногда при нулевом `frame` вообще не отображается.

```swift
let label = UILabel()
label.translatesAutoresizingMaskIntoConstraints = false   // обязательно до активации констрейнтов
view.addSubview(label)
NSLayoutConstraint.activate([...])
```

У view, созданных в Interface Builder, свойство уже отключено. Для view, которыми управляет система (например, `contentView`), его не меняют. Если раскладка ведётся вручную по `frame`, свойство оставляют включённым.
