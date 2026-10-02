---
title: "Как отменить задачу в OperationQueue?"
category: concurrency
order: 44
---

Вызвать метод `cancel()`. Однако отмена требует ручной проверки флага `isCancelled` в коде операции.
