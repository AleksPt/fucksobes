---
title: "Когда вызывается loadView() у ViewController? Зачем он нужен?"
category: uikit
order: 29
---

Вызывается при первом обращении к `view` (это lazy var). Нужен, чтобы подставить свою кастомную view.
