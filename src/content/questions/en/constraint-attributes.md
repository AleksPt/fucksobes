---
title: "Name the main attributes of a constraint and explain what each one means"
category: uikit
order: 78
---

`NSLayoutConstraint` describes the equation `firstItem.firstAttribute relation secondItem.secondAttribute * multiplier + constant`:

- `firstItem` and `firstAttribute`: the view (or layout guide) and its attribute (`top`, `leading`, `width`, `centerX`, etc.);
- `relation`: the relation, one of `equal`, `lessThanOrEqual`, `greaterThanOrEqual`;
- `secondItem` and `secondAttribute`: what we compare against; can be `nil` when a constant is set (for example, a fixed width);
- `multiplier`: a multiplier for the second attribute (sets proportions);
- `constant`: a constant offset;
- `priority`: a priority from 1 to 1000; 1000 (`required`) is mandatory, and the system may break the others if they conflict;
- `isActive`: whether the constraint is enabled.

After creation, the properties are read-only except `constant`, `isActive` and `priority` (the latter cannot be changed to or from `required` after activation). `multiplier` cannot be changed: to change it, the constraint is recreated.
