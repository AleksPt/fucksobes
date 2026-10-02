---
title: "Где раньше узнавали фрейм экрана до появления ViewIsAppearing?"
category: uikit
order: 27
---

В `viewDidLayoutSubviews`. Обращались и к `viewWillAppear`, но там геометрия и trait collection ещё не актуальны (view не добавлена в иерархию): именно поэтому появился `viewIsAppearing`.
