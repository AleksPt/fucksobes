---
title: "Что будет, если в GCD вызвать метод `DispatchQueue.main.sync()` внутри метода `viewDidLoad()`"
category: concurrency
order: 21
---

**Да, можно, но только не находясь на главной очереди.**

Если попытаться вызвать DispatchQueue.main.sync из главной очереди, это приведёт к взаимоблокировке (deadlock).

---

deadlock (?)
