---
title: "Нужно ли вызывать super в LoadView? Почему?"
category: uikit
order: 30
---

Нет, это вызовет рекурсию, так как LoadView — lazy метод.
