---
title: "Любая ли UIView наследуется от UIControl? Что это за класс?"
category: uikit
order: 52
---

Нет. `UIView` — конкретный класс, базовый для любых видимых элементов интерфейса, а `UIControl` — базовый класс именно для элементов управления вроде `UIButton`, `UISlider`, `UISwitch`, `UISegmentedControl`, то есть не каждый view является control.

`UIControl` напрямую не создают, это точка расширения для собственных контролов. Он даёт механизм target-action (`addTarget(_:action:for:)`), состояния и события (`touchUpInside`, `valueChanged`), поэтому вместо отслеживания касаний вручную достаточно написать action-метод.
