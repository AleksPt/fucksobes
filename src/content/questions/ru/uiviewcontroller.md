---
title: "Что такое UIViewController и за что он отвечает"
category: uikit
order: 20
---

`UIViewController` — объект, управляющий иерархией view в UIKit-приложении. Его корневой view хранится в свойстве `view`, и загружается он лениво: при первом обращении к `view`. Обычно вы создаёте подкласс и добавляете в него логику своего экрана.

За что отвечает:

- управление view и их загрузкой (из storyboard, nib или программно);
- реакция на изменение видимости view (`viewIsAppearing(_:)`, `viewWillDisappear(_:)` и другие callbacks);
- реакция на изменение размера view, в том числе при повороте (`viewWillTransition(to:with:)`);
- работа контейнером для дочерних view controllers;
- реакция на нехватку памяти (`didReceiveMemoryWarning()`);
- сохранение и восстановление состояния.

Кроме того, view controller — это `UIResponder`, он входит в responder chain между корневым view и его superview.
