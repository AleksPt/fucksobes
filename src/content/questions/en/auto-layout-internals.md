---
title: "How does Auto Layout work internally?"
category: uikit
order: 114
---

Auto Layout turns constraints into a system of linear equations and inequalities. Each constraint such as `view1.leading = view2.trailing + 8` is written as a linear expression over variables (the positions and sizes of views), and priorities define the "weight" of optional constraints.

The problem is solved by a built-in engine (reportedly based on the Cassowary algorithm, an incremental simplex method for linear constraints with priorities; Apple's documentation does not say so explicitly). It finds values for the variables that satisfy the required constraints, while violating the optional ones as little as possible according to their priorities. The engine works incrementally: when one constraint is added or changed, only the affected part is recalculated.

The work goes through three update phases, repeated until the layout stabilizes: updating constraints (`updateConstraints`), layout (`layoutSubviews`, where the computed values are turned into `frame`s) and drawing. The cost of solving grows with the number of connected constraints, so a large number of interdependent constraints can slow things down.
