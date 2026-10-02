---
title: "How does constraint priority work?"
category: uikit
order: 98
---

Every constraint has a priority from 1 to 1000. The value `1000` (`.required`) is a mandatory constraint: the system must satisfy it. Values below 1000 are optional: the engine tries to satisfy them in descending order of priority, and if they conflict with more important ones, it breaks them.

- Two required constraints that cannot be satisfied at the same time cause the "Unable to simultaneously satisfy constraints" error, and the system breaks one of them.
- Optional ones (`.defaultHigh` = 750, `.defaultLow` = 250, or your own, such as 999) let you express "desired" behavior and fallbacks.
- Hugging and compression resistance priorities are also priorities, but for stretching and compressing based on content.

The priority of an already active constraint can only be changed between optional values: switching from `.required` to something else and back is not allowed, and the constraint has to be recreated. A good practice is to use 999 instead of 1000 when a constraint should hold "almost always" but must not break the layout during a temporary conflict (for example, during an animation).
