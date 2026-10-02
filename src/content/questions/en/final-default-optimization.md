---
title: "Will the final optimization be applied by default, or do we need to do something?"
category: swift
order: 85
---

Not for all declarations: methods and properties of classes use dynamic dispatch by default (an indirect call through the vtable), and `final` is not set on its own. But the compiler can infer `final` automatically if it sees all possible overrides:

- for `private` and `fileprivate` declarations — if there are no overriding declarations in the file;
- for `internal` — if whole-module optimization (WMO) is enabled: then the optimizer sees the entire module. Since `internal` is the default access level, enabling WMO gives additional devirtualization without changing the code.

An explicit `final` prevents overriding and lets the compiler call the implementation directly.
