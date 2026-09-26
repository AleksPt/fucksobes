---
title: "Что будет, если в GCD вызвать метод `DispatchQueue.main.sync()` внутри метода `viewDidLoad()`"
category: concurrency
order: 21
---

Произойдёт **deadlock** (взаимоблокировка): `viewDidLoad()` выполняется на главной очереди, а вызывать `DispatchQueue.main.sync` можно только не находясь на ней.
