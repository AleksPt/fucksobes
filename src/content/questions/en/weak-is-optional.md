---
title: "Is weak an optional or not?"
category: memory
order: 30
---

Yes, a `weak` reference is an optional variable: it is always declared with `var` (not `let`) and has an optional type. When the instance is deallocated, ARC automatically writes `nil` into it.

```swift
class Owner { weak var friend: Friend? }
```

`unowned`, by contrast, does not make the value optional: ARC never zeroes such a reference.

