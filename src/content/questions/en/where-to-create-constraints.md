---
title: "Where is it preferable to create and activate constraints?"
category: uikit
order: 93
---

Constraints are created once when the screen is set up, not on every layout pass:

- in a controller, in `viewDidLoad()`, when the view hierarchy has already been created but not yet shown;
- in a custom view, in the initializer (`init(frame:)`, `init(coder:)`) or in `updateConstraints()` if their set depends on state;
- activate them in a batch through `NSLayoutConstraint.activate([...])`: this is more efficient than enabling them one by one.

Don't create constraints in `viewDidLayoutSubviews()` and `layoutSubviews()`: they are called on every layout pass, so the constraints would be added again and again.

Before adding constraints to a view created in code, you need to turn off `translatesAutoresizingMaskIntoConstraints`. To change the layout later, keep references to the constraints and change `constant` or `isActive` instead of creating new ones.
