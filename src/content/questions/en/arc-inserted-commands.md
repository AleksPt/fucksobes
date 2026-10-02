---
title: "Which commands can ARC insert into the code?"
category: memory
order: 20
---

1. `retain` — increments the object's reference count.
2. `release` — decrements the reference count; if the count reaches 0, it frees the object.
3. `autorelease` — adds the object to an autorelease pool so that it is released later.
4. `store strong` — assigns an object to a strong property with the corresponding ownership (`retain`).
5. `store weak` — assigns an object to a weak property without incrementing the reference count.
6. `load weak` — reads an object from a weak property, checking whether it has been zeroed.
