---
title: "The difference between weak and unowned"
category: memory
order: 28
---

- **`weak`** — used when the reference can become `nil` at any moment after creation.
- **`unowned`** — slightly faster; used when you are sure the reference always points to a valid object and will not become `nil` during its lifetime.
- `weak` creates a side table, `unowned` does not.
