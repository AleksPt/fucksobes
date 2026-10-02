---
title: "How does Auto Layout resolve constraint conflicts?"
category: uikit
order: 106
---

If the system of constraints cannot be satisfied in full, the following logic applies:

- required (priority 1000) constraints must be satisfied. If they contradict each other, the engine prints "Unable to simultaneously satisfy constraints" to the console, lists the conflicting constraints, and breaks (discards) one of them so that the layout remains workable;
- optional (priority below 1000) ones are satisfied where possible: the engine tries to satisfy them in descending order of priority, and conflicting constraints with lower priority are violated or only partially satisfied.

How to find and fix it: enable the symbolic breakpoint `UIViewAlertForUnsatisfiableConstraints`, read the message (constraints can be given an `identifier`), and then lower the priority of the extra constraint (for example, to 999), remove the duplicate, or use inequalities (`≥`, `≤`) instead of equality. An ambiguous layout (not enough constraints) is diagnosed separately and shows up in the View Hierarchy debugger as "ambiguous layout".
