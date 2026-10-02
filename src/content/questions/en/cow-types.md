---
title: "Which types support copy-on-write?"
category: memory
order: 55
---

Collections (`Array`, `Set`, `Dictionary`) and `String`. Simple types like `Int` do not support COW: they have no shared buffer.
