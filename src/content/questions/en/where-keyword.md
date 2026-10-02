---
title: "What is the where keyword for?"
category: swift
order: 145
---

`where` adds a condition or constraint. The main uses:

- **Generic and protocol constraints:**

```swift
func firstDuplicate<T: Sequence>(_ s: T) -> T.Element? where T.Element: Hashable { ... }
func sum<C: Collection>(_ c: C) -> Int where C.Element == Int { c.reduce(0, +) }
```

- **Conditional extensions and conformances:** `extension Array where Element: Numeric { ... }`, `extension Box: Codable where T: Codable {}`.
- **A filter in `for`:** `for n in numbers where n % 2 == 0 { ... }`.
- **A condition in `switch`:** `case let x where x > 10:`; in `catch` — `catch let e as MyError where e.isRetryable`.
- **Additional requirements in protocols:** `associatedtype Item where Item: Equatable`.

This way `where` lets you describe requirements right in the signature, makes code more expressive, and replaces nested `if` checks inside loops and `switch`.
