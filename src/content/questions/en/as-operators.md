---
title: "What is the difference between as, as?, and as! in Swift?"
category: swift
order: 139
---

All three operators perform type casting, but in different situations:

- `as` — a cast that is guaranteed to succeed: an upcast to a superclass or protocol, as well as bridging (`String as NSString`) and literals (`1 as Double`). There is no need to check the result.
- `as?` — a conditional downcast: it returns an optional of the target type, and `nil` if the object is not of that type.
- `as!` — a forced downcast: it returns a value of the target type, and the app crashes on failure.

```swift
let view: UIView = UILabel()
let label = view as? UILabel      // UILabel?
let button = view as! UIButton    // crash: it is a UILabel
```

The `is` operator only checks the type: `view is UILabel` returns a `Bool`. The safe option is `if let label = view as? UILabel`, while `as!` is acceptable when the type is known for certain.
