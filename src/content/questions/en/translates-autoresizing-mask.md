---
title: "What happens if you forget to turn off translatesAutoresizingMaskIntoConstraints?"
category: uikit
order: 96
---

By default, for views created in code the `translatesAutoresizingMaskIntoConstraints` property is `true`: the system turns the `frame` and the autoresizing mask into constraints of its own for that view. If you also add your own constraints to such a view, they start conflicting with the automatic ones.

The result: an "Unable to simultaneously satisfy constraints" warning in the console, and the system breaks one of the constraints; the view may end up in the wrong place or have the wrong size, and sometimes, with a zero `frame`, is not displayed at all.

```swift
let label = UILabel()
label.translatesAutoresizingMaskIntoConstraints = false   // required before activating constraints
view.addSubview(label)
NSLayoutConstraint.activate([...])
```

For views created in Interface Builder the property is already turned off. For views managed by the system (for example, `contentView`), you don't change it. If layout is done manually by `frame`, leave the property turned on.
