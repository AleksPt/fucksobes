---
title: "Is a value type always passed by copying?"
category: memory
order: 53
---

Not always: for collections, the compiler applies the `copy-on-write` optimization. It avoids copying until the instance is modified, which prevents unnecessary copies and improves performance.
