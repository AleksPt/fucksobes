---
title: "В каком методе жизненного цикла ViewController известны точные размеры view?"
category: uikit
order: 34
---

`viewDidLayoutSubviews()`: здесь уже известны итоговые frame subviews. Размер самого view корректен и раньше, в `viewIsAppearing(_:)`.
