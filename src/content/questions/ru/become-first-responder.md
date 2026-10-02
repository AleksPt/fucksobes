---
title: "У любой вьюхи есть возможность стать респондером? Какой класс позволяет стать First Responder?"
category: uikit
order: 51
---

Нет, не любая. Стать first responder может только `UIResponder` (его наследуют `UIView`, `UIViewController`, `UIApplication`), но и для него `canBecomeFirstResponder` по умолчанию возвращает `false`. Подкласс должен переопределить это свойство и вернуть `true`.

Вызов `becomeFirstResponder()` не гарантирует успех: UIKit сначала просит текущего first responder уступить эту роль, а он может отказаться. Метод нужно вызывать только для view из активной иерархии (у которой есть `window`). Например, `UITextField` и `UITextView` становятся first responder при касании и показывают клавиатуру.

