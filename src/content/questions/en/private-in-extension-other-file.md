---
title: "What if the extension is placed outside the file?"
category: swift
order: 36
---

No. If the `extension` is **in another file**, the `private` variable will not be accessible and the compiler will report an error.

**The difference between `private` and `fileprivate`**

- **`private`** — access to properties and methods only within **one file and the same type** (or its `extension` in the same file).
- **`fileprivate`** — access only within **one file**, but it is also available to other types and `extension`s in that same file.
