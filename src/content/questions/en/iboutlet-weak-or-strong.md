---
title: "Which modifier (weak or strong) should you use for an IBOutlet, and why?"
category: uikit
order: 126
---

For an outlet to a subview, Xcode creates `weak` by default: `@IBOutlet weak var label: UILabel!`. The view normally already belongs to the hierarchy: the parent holds a strong reference to its subviews, so a weak reference is enough for the controller object. This avoids an extra strong reference and lowers the risk of a retain cycle, and when the view is removed from the hierarchy it is released and the outlet becomes `nil`.

`strong` is needed when the controller must hold the object itself:

- an outlet to a view that you remove from the hierarchy and plan to bring back (otherwise it is released after `removeFromSuperview`);
- an outlet to a constraint (`NSLayoutConstraint`) that you activate and deactivate: when deactivated, nobody else holds it;
- an outlet to top-level xib objects and to objects that are not part of the hierarchy.

A weak outlet is an optional, and it is declared as an `Optional` or an implicitly unwrapped optional (`!`), because it is populated after the view is loaded. This is also Apple's recommendation: `weak` for outlets to subviews, `strong` for a nib's top-level objects.
