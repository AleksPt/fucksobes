---
title: "Как руками можно сделать чтобы в GCD можно было отменять операцию"
category: concurrency
order: 35
---

- **`DispatchWorkItem`** с методом `cancel()`.
- **Пользовательский флаг** (`isCancelled`).
- **Токен отмены** (`CancellationToken`) для более сложных сценариев.
