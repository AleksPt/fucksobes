---
title: "Layout methods used when working with constraints"
category: uikit
order: 38
---

`updateConstraints()`, `setNeedsUpdateConstraints()`, `updateConstraintsIfNeeded()`

- `setNeedsUpdateConstraints()` marks the view's constraints as outdated, and on the next pass the system will call `updateConstraints()`;
- `updateConstraints()` is an overridable method in which constraints are created and updated (you must call `super` at the end);
- `updateConstraintsIfNeeded()` performs the update immediately if one has been requested.
