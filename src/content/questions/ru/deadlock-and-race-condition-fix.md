---
title: "Как избавиться от Deadlock и Race Condition"
category: concurrency
order: 54
---

**Предотвращение Race Condition.** Используйте механизмы синхронизации:

- **Мьютексы (`NSLock`)** — эксклюзивный доступ к ресурсу.
- **Семафоры (`DispatchSemaphore`).**
- **Очереди (`DispatchQueue`)** — серийные очереди для работы с общими ресурсами.
