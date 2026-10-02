---
title: "We decided to write our own array implementation and made it conform to the Collection protocol. Will we get copy-on-write in that case?"
category: memory
order: 58
---

**Copy-on-Write will not appear automatically**: unless you implement it explicitly, you won't have it. Swift does not provide COW "by default" for custom structs, even if they conform to `Collection`.
