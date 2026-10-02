---
title: "If there are several nested closures, do you have to write [weak self] in each one?"
category: memory
order: 80
---

No, not necessarily. `[weak self]` is needed where a closure creates a **strong reference cycle**: `self` stores the closure (directly or through a chain of objects), and the closure strongly captures `self`. If there is no cycle, a weak reference is not needed.

How to handle nesting:

- It is enough to put `[weak self]` in the **outer** closure. The inner closure will capture the already weak (optional) `self` variable rather than a strong reference.
- If you do `guard let self` in the outer closure, the inner one will capture `self` strongly. This is safe as long as the inner closure is short-lived and is not stored in `self`: the strong reference lives only until it finishes.
- For **non-escaping** closures (`map`, `filter`, `forEach`, `sync`), weak capture is not needed: they run immediately and are not stored.
- If the inner closure is also stored (for example, in a property of `self` or in a long-lived object), it needs its own `[weak self]`.

```swift
func load() {
    // Outer closure: weak capture breaks the cycle
    service.fetch { [weak self] result in
        guard let self else { return }

        // The inner closure runs immediately and is not stored,
        // so an extra [weak self] is not needed
        let items = result.map { self.convert($0) }

        // The closure goes to another queue and is short-lived:
        // the strong reference is released once it runs
        DispatchQueue.main.async {
            self.items = items
        }
    }
}
```
