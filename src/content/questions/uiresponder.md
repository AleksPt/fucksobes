---
title: "UIResponder"
category: uikit
order: 49
---

`UIResponder` — абстрактный интерфейс для получения и обработки событий, основа event-handling в UIKit. Респондерами являются `UIApplication`, `UIViewController` и все `UIView` (включая `UIWindow`).

Чтобы обрабатывать события, респондер переопределяет соответствующие методы: для касаний это `touchesBegan(_:with:)`, `touchesMoved(_:with:)`, `touchesEnded(_:with:)`, `touchesCancelled(_:with:)`. Виды событий: касания, движения, remote-control и press-события. Необработанное событие респондер передаёт следующему в responder chain (view — своему superview, корневой view — view controller). Респондеры также могут принимать ввод через input view, например клавиатуру у `UITextField`.
