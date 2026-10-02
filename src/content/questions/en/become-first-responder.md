---
title: "Can any view become a responder? Which class allows becoming the first responder?"
category: uikit
order: 51
---

No, not any. Only a `UIResponder` can become the first responder (`UIView`, `UIViewController` and `UIApplication` inherit from it), but even for it `canBecomeFirstResponder` returns `false` by default. A subclass must override this property and return `true`.

Calling `becomeFirstResponder()` does not guarantee success: UIKit first asks the current first responder to give up the role, and it may refuse. The method should be called only for a view in an active hierarchy (one that has a `window`). For example, `UITextField` and `UITextView` become the first responder on touch and show the keyboard.
