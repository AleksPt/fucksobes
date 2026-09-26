---
title: "Методы для лейаута при работе с констрейнтами"
category: uikit
order: 38
---

`updateConstraints()`, `setNeedsUpdateConstraints()`, `updateConstraintsIfNeeded()`

- `setNeedsUpdateConstraints()` помечает констрейнты view устаревшими, и на ближайшем проходе система вызовет `updateConstraints()`;
- `updateConstraints()` — переопределяемый метод, в котором создают и обновляют констрейнты (вызывать `super` нужно в конце);
- `updateConstraintsIfNeeded()` выполняет обновление сразу, если оно запрошено.
